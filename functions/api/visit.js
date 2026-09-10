export async function onRequestPost(context) {
    const db = context.env.DB;

    if (!db) {
        return Response.json(
            { ok: false, error: "D1 chưa được cấu hình." },
            { status: 503 }
        );
    }

    const ip =
        context.request.headers.get("CF-Connecting-IP") ||
        "unknown";

    const now = new Date();
    const nowISO = now.toISOString();

    // =========================
    // KIỂM TRA IP ĐANG BỊ BAN
    // =========================

    try {
        const banned = await db
            .prepare(`
                SELECT
                    ip,
                    reason,
                    expires_at,
                    permanent
                FROM banned_ips
                WHERE ip = ?
                LIMIT 1
            `)
            .bind(ip)
            .first();

        if (banned) {
            if (banned.permanent === 1) {
                return Response.json(
                    {
                        ok: false,
                        blocked: true,
                        error: "IP này đã bị chặn vĩnh viễn."
                    },
                    {
                        status: 403,
                        headers: {
                            "Cache-Control": "no-store"
                        }
                    }
                );
            }

            if (
                banned.expires_at &&
                new Date(banned.expires_at) > now
            ) {
                return Response.json(
                    {
                        ok: false,
                        blocked: true,
                        error: "IP này đang bị chặn."
                    },
                    {
                        status: 403,
                        headers: {
                            "Cache-Control": "no-store"
                        }
                    }
                );
            }

            // Hết hạn ban → tự xóa
            await db
                .prepare(`
                    DELETE FROM banned_ips
                    WHERE ip = ?
                `)
                .bind(ip)
                .run();
        }

    } catch (error) {
        console.error("Ban check error:", error);
    }


    // =========================
    // LẤY PATH
    // =========================

    let body = {};

    try {
        body = await context.request.json();
    } catch (_) {
        body = {};
    }

    const path =
        typeof body.path === "string" &&
        body.path.length <= 500
            ? body.path
            : "/";


    try {

        // =========================
        // LƯU LƯỢT TRUY CẬP
        // =========================

        await db
            .prepare(`
                INSERT INTO visitors (
                    ip,
                    first_seen,
                    last_seen,
                    visit_count
                )
                VALUES (?, ?, ?, 1)

                ON CONFLICT(ip)
                DO UPDATE SET
                    last_seen = excluded.last_seen,
                    visit_count =
                        visitors.visit_count + 1
            `)
            .bind(ip, nowISO, nowISO)
            .run();


        await db
            .prepare(`
                INSERT INTO visits (
                    ip,
                    visited_at,
                    path
                )
                VALUES (?, ?, ?)
            `)
            .bind(ip, nowISO, path)
            .run();


        // =========================
        // ĐỌC CẤU HÌNH BẢO MẬT
        // =========================

        const config = await db
            .prepare(`
                SELECT
                    warn_threshold,
                    critical_threshold,
                    auto_ban_threshold,
                    auto_ban_permanent
                FROM security_config
                WHERE id = 1
                LIMIT 1
            `)
            .first();


        const warnThreshold =
            Number(config?.warn_threshold || 30);

        const criticalThreshold =
            Number(config?.critical_threshold || 200);

        const autoBanThreshold =
            Number(config?.auto_ban_threshold || 1000);

        const autoBanPermanent =
            Number(config?.auto_ban_permanent || 1);


        // =========================
        // ĐẾM REQUEST 10 GIÂY GẦN NHẤT
        // =========================

        const windowStart =
            new Date(
                now.getTime() - 10000
            ).toISOString();

        const rate = await db
            .prepare(`
                SELECT COUNT(*) AS request_count
                FROM visits
                WHERE ip = ?
                AND visited_at >= ?
            `)
            .bind(ip, windowStart)
            .first();

        const requestCount =
            Number(rate?.request_count || 0);


        // =========================
        // CỰC CAO → TỰ BAN
        // =========================

        if (requestCount >= autoBanThreshold) {

            const reason =
                `Tự động ban: ${requestCount} request trong 10 giây`;

            const permanent =
                autoBanPermanent === 1;

            const expiresAt =
                permanent
                    ? null
                    : new Date(
                        now.getTime() + 10 * 60 * 1000
                    ).toISOString();

            await db
                .prepare(`
                    INSERT OR REPLACE INTO banned_ips (
                        ip,
                        reason,
                        banned_at,
                        expires_at,
                        permanent
                    )
                    VALUES (?, ?, ?, ?, ?)
                `)
                .bind(
                    ip,
                    reason,
                    nowISO,
                    expiresAt,
                    permanent ? 1 : 0
                )
                .run();


            await db
                .prepare(`
                    INSERT INTO security_events (
                        ip,
                        event_type,
                        request_count,
                        window_seconds,
                        detected_at
                    )
                    VALUES (?, ?, ?, ?, ?)
                `)
                .bind(
                    ip,
                    "AUTO_BAN",
                    requestCount,
                    10,
                    nowISO
                )
                .run();


            return Response.json(
                {
                    ok: false,
                    blocked: true,
                    autoBanned: true,
                    requestCount
                },
                {
                    status: 403,
                    headers: {
                        "Cache-Control": "no-store"
                    }
                }
            );
        }


        // =========================
        // 200+ → CẢNH BÁO NGHIÊM TRỌNG
        // =========================

        if (requestCount >= criticalThreshold) {

            await db
                .prepare(`
                    INSERT INTO security_events (
                        ip,
                        event_type,
                        request_count,
                        window_seconds,
                        detected_at
                    )
                    VALUES (?, ?, ?, ?, ?)
                `)
                .bind(
                    ip,
                    "CRITICAL",
                    requestCount,
                    10,
                    nowISO
                )
                .run();

        }

        // =========================
        // 30+ → CẢNH BÁO
        // =========================

        else if (requestCount >= warnThreshold) {

            await db
                .prepare(`
                    INSERT INTO security_events (
                        ip,
                        event_type,
                        request_count,
                        window_seconds,
                        detected_at
                    )
                    VALUES (?, ?, ?, ?, ?)
                `)
                .bind(
                    ip,
                    "WARNING",
                    requestCount,
                    10,
                    nowISO
                )
                .run();

        }


        return Response.json(
            {
                ok: true,
                requestCount
            },
            {
                headers: {
                    "Cache-Control": "no-store"
                }
            }
        );

    } catch (error) {

        console.error(
            "Visitor tracking error:",
            error
        );

        return Response.json(
            {
                ok: false,
                error: "Không thể lưu lượt truy cập."
            },
            {
                status: 500
            }
        );
    }
}


export async function onRequest(context) {

    if (context.request.method === "POST") {
        return onRequestPost(context);
    }

    return new Response(
        "Method Not Allowed",
        {
            status: 405,
            headers: {
                Allow: "POST"
            }
        }
    );
}
function unauthorized() {
    return Response.json(
        {
            ok: false,
            error: "Không có quyền truy cập."
        },
        { status: 401 }
    );
}

export async function onRequestGet(context) {
    const expectedToken = context.env.ADMIN_TOKEN;
    const authorization =
        context.request.headers.get("Authorization") || "";

    if (
        !expectedToken ||
        authorization !== `Bearer ${expectedToken}`
    ) {
        return unauthorized();
    }

    const db = context.env.DB;

    if (!db) {
        return Response.json(
            {
                ok: false,
                error: "D1 chưa được cấu hình."
            },
            { status: 503 }
        );
    }

    try {
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

        const banned = await db
            .prepare(`
                SELECT
                    ip,
                    reason,
                    banned_at,
                    expires_at,
                    permanent
                FROM banned_ips
                ORDER BY banned_at DESC
                LIMIT 500
            `)
            .all();

        const events = await db
            .prepare(`
                SELECT
                    id,
                    ip,
                    event_type,
                    request_count,
                    window_seconds,
                    detected_at
                FROM security_events
                ORDER BY id DESC
                LIMIT 100
            `)
            .all();

        return Response.json(
            {
                ok: true,

                config: {
                    warnThreshold: Number(
                        config?.warn_threshold || 30
                    ),
                    criticalThreshold: Number(
                        config?.critical_threshold || 200
                    ),
                    autoBanThreshold: Number(
                        config?.auto_ban_threshold || 1000
                    ),
                    autoBanPermanent: Number(
                        config?.auto_ban_permanent || 1
                    )
                },

                bannedIPs: banned.results || [],
                securityEvents: events.results || []
            },
            {
                headers: {
                    "Cache-Control": "no-store"
                }
            }
        );

    } catch (error) {
        console.error("Security GET error:", error);

        return Response.json(
            {
                ok: false,
                error: "Không thể đọc dữ liệu bảo mật."
            },
            { status: 500 }
        );
    }
}


export async function onRequestPost(context) {
    const expectedToken = context.env.ADMIN_TOKEN;
    const authorization =
        context.request.headers.get("Authorization") || "";

    if (
        !expectedToken ||
        authorization !== `Bearer ${expectedToken}`
    ) {
        return unauthorized();
    }

    const db = context.env.DB;

    if (!db) {
        return Response.json(
            {
                ok: false,
                error: "D1 chưa được cấu hình."
            },
            { status: 503 }
        );
    }

    let body;

    try {
        body = await context.request.json();
    } catch {
        return Response.json(
            {
                ok: false,
                error: "Dữ liệu không hợp lệ."
            },
            { status: 400 }
        );
    }

    const action = body.action;


    // =========================
    // BAN IP
    // =========================

    if (action === "ban") {
        const ip =
            typeof body.ip === "string"
                ? body.ip.trim()
                : "";

        const reason =
            typeof body.reason === "string" &&
            body.reason.trim()
                ? body.reason.trim()
                : "Admin ban IP";

        const permanent =
            body.permanent === true;

        const durationMinutes =
            Number(body.durationMinutes || 0);

        if (!ip) {
            return Response.json(
                {
                    ok: false,
                    error: "Thiếu IP."
                },
                { status: 400 }
            );
        }

        if (!permanent && durationMinutes <= 0) {
            return Response.json(
                {
                    ok: false,
                    error: "Thời gian ban không hợp lệ."
                },
                { status: 400 }
            );
        }

        const bannedAt =
            new Date().toISOString();

        const expiresAt =
            permanent
                ? null
                : new Date(
                    Date.now() +
                    durationMinutes * 60 * 1000
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
                bannedAt,
                expiresAt,
                permanent ? 1 : 0
            )
            .run();

        return Response.json({
            ok: true,
            action: "ban",
            ip,
            permanent,
            expiresAt
        });
    }


    // =========================
    // BỎ BAN
    // =========================

    if (action === "unban") {
        const ip =
            typeof body.ip === "string"
                ? body.ip.trim()
                : "";

        if (!ip) {
            return Response.json(
                {
                    ok: false,
                    error: "Thiếu IP."
                },
                { status: 400 }
            );
        }

        await db
            .prepare(`
                DELETE FROM banned_ips
                WHERE ip = ?
            `)
            .bind(ip)
            .run();

        return Response.json({
            ok: true,
            action: "unban",
            ip
        });
    }


    // =========================
    // CẬP NHẬT CẤU HÌNH
    // =========================

    if (action === "config") {
        const warnThreshold =
            Number(body.warnThreshold);

        const criticalThreshold =
            Number(body.criticalThreshold);

        const autoBanThreshold =
            Number(body.autoBanThreshold);

        if (
            !Number.isInteger(warnThreshold) ||
            !Number.isInteger(criticalThreshold) ||
            !Number.isInteger(autoBanThreshold) ||
            warnThreshold < 1 ||
            criticalThreshold <= warnThreshold ||
            autoBanThreshold <= criticalThreshold
        ) {
            return Response.json(
                {
                    ok: false,
                    error: "Ngưỡng không hợp lệ."
                },
                { status: 400 }
            );
        }

        await db
            .prepare(`
                UPDATE security_config
                SET
                    warn_threshold = ?,
                    critical_threshold = ?,
                    auto_ban_threshold = ?
                WHERE id = 1
            `)
            .bind(
                warnThreshold,
                criticalThreshold,
                autoBanThreshold
            )
            .run();

        return Response.json({
            ok: true,
            config: {
                warnThreshold,
                criticalThreshold,
                autoBanThreshold
            }
        });
    }

    // =========================
// XÓA 1 CẢNH BÁO
// =========================

if (action === "delete_event") {
    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
        return Response.json(
            {
                ok: false,
                error: "ID cảnh báo không hợp lệ."
            },
            { status: 400 }
        );
    }

    await db
        .prepare(`
            DELETE FROM security_events
            WHERE id = ?
        `)
        .bind(id)
        .run();

    return Response.json({
        ok: true,
        action: "delete_event",
        id
    });
}


// =========================
// XÓA TẤT CẢ CẢNH BÁO
// =========================

if (action === "delete_all_events") {
    await db
        .prepare(`
            DELETE FROM security_events
        `)
        .run();

    return Response.json({
        ok: true,
        action: "delete_all_events"
    });
}

// =========================
// XÓA LỊCH SỬ LƯỢT TRUY CẬP
// =========================

if (action === "delete_visits") {

    await db
        .prepare(`
            DELETE FROM visits
        `)
        .run();

    return Response.json({
        ok: true,
        action: "delete_visits"
    });
}


// =========================
// XÓA TOÀN BỘ THỐNG KÊ
// =========================

if (action === "delete_statistics") {

    await db
        .prepare(`
            DELETE FROM visits
        `)
        .run();

    await db
        .prepare(`
            DELETE FROM visitors
        `)
        .run();

    return Response.json({
        ok: true,
        action: "delete_statistics"
    });
}

    return Response.json(
        {
            ok: false,
            error: "Action không hợp lệ."
        },
        { status: 400 }
    );
}


export async function onRequest(context) {
    if (context.request.method === "GET") {
        return onRequestGet(context);
    }

    if (context.request.method === "POST") {
        return onRequestPost(context);
    }

    return new Response(
        "Method Not Allowed",
        {
            status: 405,
            headers: {
                Allow: "GET, POST"
            }
        }
    );
}
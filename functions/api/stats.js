function unauthorized() {
    return Response.json(
        { ok: false, error: "Không có quyền truy cập." },
        { status: 401 }
    );
}

export async function onRequestGet(context) {
    const expectedToken = context.env.ADMIN_TOKEN;
    const authorization = context.request.headers.get("Authorization") || "";

    if (!expectedToken || authorization !== `Bearer ${expectedToken}`) {
        return unauthorized();
    }

    const db = context.env.DB;

    if (!db) {
        return Response.json(
            { ok: false, error: "D1 chưa được cấu hình." },
            { status: 503 }
        );
    }

    try {
        const totals = await db
            .prepare(`
                SELECT
                    COUNT(*) AS total_unique_ips,
                    COALESCE(SUM(visit_count), 0) AS total_visits
                FROM visitors
            `)
            .first();

        const visitors = await db
            .prepare(`
                SELECT
                    ip,
                    visit_count,
                    first_seen,
                    last_seen
                FROM visitors
                ORDER BY visit_count DESC, last_seen DESC
                LIMIT 500
            `)
            .all();

        const recentVisits = await db
            .prepare(`
                SELECT
                    ip,
                    visited_at,
                    path
                FROM visits
                ORDER BY id DESC
                LIMIT 100
            `)
            .all();

        return Response.json({
            ok: true,
            totalVisits: Number(totals?.total_visits || 0),
            totalUniqueIPs: Number(totals?.total_unique_ips || 0),
            visitors: visitors.results || [],
            recentVisits: recentVisits.results || []
        }, {
            headers: { "Cache-Control": "no-store" }
        });
    } catch (error) {
        console.error("Stats error:", error);

        return Response.json(
            { ok: false, error: "Không thể đọc dữ liệu thống kê." },
            { status: 500 }
        );
    }
}

export async function onRequest(context) {
    if (context.request.method === "GET") {
        return onRequestGet(context);
    }

    return new Response("Method Not Allowed", {
        status: 405,
        headers: { Allow: "GET" }
    });
}

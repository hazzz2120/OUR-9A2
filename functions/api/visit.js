export async function onRequestPost(context) {
    const db = context.env.DB;

    if (!db) {
        return Response.json(
            { ok: false, error: "D1 chưa được cấu hình." },
            { status: 503 }
        );
    }

    const ip = context.request.headers.get("CF-Connecting-IP") || "unknown";
    const userAgent = context.request.headers.get("User-Agent") || "";
    const now = new Date().toISOString();

    let body = {};

    try {
        body = await context.request.json();
    } catch (_) {
        body = {};
    }

    const path =
        typeof body.path === "string" && body.path.length <= 500
            ? body.path
            : "/";

    try {
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
                    visit_count = visitors.visit_count + 1
            `)
            .bind(ip, now, now)
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
            .bind(ip, now, path)
            .run();

        return Response.json(
            { ok: true },
            { headers: { "Cache-Control": "no-store" } }
        );
    } catch (error) {
        console.error("Visitor tracking error:", error);

        return Response.json(
            { ok: false, error: "Không thể lưu lượt truy cập." },
            { status: 500 }
        );
    }
}

export async function onRequest(context) {
    if (context.request.method === "POST") {
        return onRequestPost(context);
    }

    return new Response("Method Not Allowed", {
        status: 405,
        headers: { Allow: "POST" }
    });
}

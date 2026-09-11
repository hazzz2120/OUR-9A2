export async function onRequest(context) {
    const db = context.env.DB;

    if (!db) {
        return context.next();
    }

    const ip =
    context.request.headers.get("CF-Connecting-IP") ||
    "unknown";

const url = new URL(context.request.url);

// Cho phép IP đang bị ban vẫn vào khu vực admin
if (
    url.pathname === "/admin.html" ||
    url.pathname.startsWith("/api/security") ||
    url.pathname.startsWith("/api/stats")
) {
    return context.next();
}

try {
        const banned = await db
            .prepare(`
                SELECT
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
                return new Response(
                    "IP của bạn đã bị chặn vĩnh viễn.",
                    {
                        status: 403,
                        headers: {
                            "Content-Type": "text/plain; charset=UTF-8"
                        }
                    }
                );
            }

            if (
                banned.expires_at &&
                new Date(banned.expires_at) > new Date()
            ) {
                return new Response(
                    "IP của bạn đang bị chặn.",
                    {
                        status: 403,
                        headers: {
                            "Content-Type": "text/plain; charset=UTF-8"
                        }
                    }
                );
            }

            await db
                .prepare(`
                    DELETE FROM banned_ips
                    WHERE ip = ?
                `)
                .bind(ip)
                .run();
        }

    } catch (error) {
        console.error("Ban middleware error:", error);
    }

    return context.next();
}
export async function onRequestGet(context) {
    const auth = context.request.headers.get("Authorization") || "";
    const adminToken = context.env.ADMIN_TOKEN || "";

    if (!adminToken || auth !== `Bearer ${adminToken}`) {
        return new Response(
            JSON.stringify({
                ok: false,
                error: "Không có quyền truy cập."
            }),
            {
                status: 401,
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-store"
                }
            }
        );
    }

    const url = new URL(context.request.url);
    const ip = url.searchParams.get("ip");

    if (!ip) {
        return new Response(
            JSON.stringify({
                ok: false,
                error: "Thiếu IP."
            }),
            {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-store"
                }
            }
        );
    }

    try {
        const response = await fetch(
            `https://ipapi.co/${encodeURIComponent(ip)}/json/`,
            {
                headers: {
                    "User-Agent": "9A2-Analytics"
                }
            }
        );

        const data = await response.json();

        return new Response(
            JSON.stringify(data),
            {
                status: response.ok ? 200 : response.status,
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-store"
                }
            }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({
                ok: false,
                error: "Không thể tra IP."
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-store"
                }
            }
        );
    }
}
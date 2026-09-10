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
        const upstream = await fetch(
            `https://api.ipapi.is/?q=${encodeURIComponent(ip)}`,
            {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }
        );

        const text = await upstream.text();

        let data;

        try {
            data = JSON.parse(text);
        } catch {
            return new Response(
                JSON.stringify({
                    ok: false,
                    error: "API IP trả dữ liệu không hợp lệ.",
                    upstreamStatus: upstream.status
                }),
                {
                    status: 502,
                    headers: {
                        "Content-Type": "application/json",
                        "Cache-Control": "no-store"
                    }
                }
            );
        }

        if (!upstream.ok) {
            return new Response(
                JSON.stringify({
                    ok: false,
                    error: data.error || "API IP từ chối yêu cầu.",
                    upstreamStatus: upstream.status
                }),
                {
                    status: 502,
                    headers: {
                        "Content-Type": "application/json",
                        "Cache-Control": "no-store"
                    }
                }
            );
        }

        return new Response(
            JSON.stringify({
                ok: true,
                ip: data.ip,
                city: data.city,
                region: data.region,
                country: data.country,
                company: data.company,
                asn: data.asn
            }),
            {
                status: 200,
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
                error: "Cloudflare không thể kết nối API IP.",
                detail: error.message
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
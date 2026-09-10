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
                    "Content-Type": "application/json"
                }
            }
        );
    }

    const db = context.env.DB;

    try {
     
        const cached = await db
            .prepare(`
                SELECT ip, city, region, country, company, asn
                FROM ip_geo
                WHERE ip = ?
            `)
            .bind(ip)
            .first();

        if (cached) {
            return new Response(
                JSON.stringify({
                    ok: true,
                    cached: true,
                    ip: cached.ip,
                    city: cached.city,
                    region: cached.region,
                    country: cached.country,
                    company: cached.company,
                    asn: cached.asn
                }),
                {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                        "Cache-Control": "no-store"
                    }
                }
            );
        }

        const upstream = await fetch(
            `https://api.ipapi.is/?q=${encodeURIComponent(ip)}`
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
                        "Content-Type": "application/json"
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
                        "Content-Type": "application/json"
                    }
                }
            );
        }

        const city = data.city || null;
        const region = data.region || null;
        const country = data.country || null;
        const company = data.company || null;
        const asn = data.asn || null;

        await db
            .prepare(`
                INSERT OR REPLACE INTO ip_geo
                (ip, city, region, country, company, asn, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `)
            .bind(
                ip,
                city,
                region,
                country,
                company,
                asn,
                new Date().toISOString()
            )
            .run();

        
        return new Response(
            JSON.stringify({
                ok: true,
                cached: false,
                ip: ip,
                city: city,
                region: region,
                country: country,
                company: company,
                asn: asn
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
                error: "Lỗi xử lý IP.",
                detail: error.message
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
}
// GET /api/content — returns full portfolio JSON from KV (public)
export async function onRequestGet({ env }) {
	try {
		const raw = await env.PORTFOLIO_DATA.get("content");
		if (!raw) {
			return new Response(JSON.stringify({ error: "No content found" }), {
				status: 404,
				headers: { "Content-Type": "application/json" },
			});
		}
		return new Response(raw, {
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "public, max-age=60, stale-while-revalidate=300",
			},
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: "Failed to fetch content" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}

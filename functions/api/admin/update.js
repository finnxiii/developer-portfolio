// POST /api/admin/update — writes portfolio JSON to KV (JWT protected)
import { verifyJWT } from "../../_jwt.js";

export async function onRequestPost({ request, env }) {
	const auth = request.headers.get("Authorization") ?? "";
	if (!auth.startsWith("Bearer ")) return jsonResponse({ error: "Unauthorized" }, 401);

	const token = auth.slice(7);
	const payload = await verifyJWT(token, env.ADMIN_PASSWORD);
	if (!payload) return jsonResponse({ error: "Invalid or expired token" }, 401);

	let data;
	try {
		data = await request.json();
	} catch {
		return jsonResponse({ error: "Invalid JSON" }, 400);
	}

	try {
		await env.PORTFOLIO_DATA.put("content", JSON.stringify(data));
		return jsonResponse({ success: true });
	} catch (err) {
		return jsonResponse({ error: "Failed to write to KV" }, 500);
	}
}

function jsonResponse(data, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { "Content-Type": "application/json" },
	});
}

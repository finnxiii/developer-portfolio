// POST /api/admin/login — validates ADMIN_PASSWORD, returns a JWT
import { signJWT } from "../../_jwt.js";

export async function onRequestPost({ request, env }) {
	let body;
	try {
		body = await request.json();
	} catch {
		return jsonResponse({ error: "Invalid JSON" }, 400);
	}

	const { password } = body;
	if (!password || password !== env.ADMIN_PASSWORD) {
		return jsonResponse({ error: "Invalid password" }, 401);
	}

	const token = await signJWT({ sub: "admin" }, env.ADMIN_PASSWORD);
	return jsonResponse({ token });
}

function jsonResponse(data, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { "Content-Type": "application/json" },
	});
}

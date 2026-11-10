const JSON_HEADERS = { "Content-Type": "application/json" };

export async function onRequestPost({ request, env }) {
	const ct = request.headers.get("content-type") ?? "";
	if (!ct.includes("application/json")) {
		return new Response(JSON.stringify({ error: "expected JSON" }), { status: 400, headers: JSON_HEADERS });
	}

	let body;
	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({ error: "invalid JSON" }), { status: 400, headers: JSON_HEADERS });
	}

	const { name, email, message, turnstileToken } = body ?? {};

	if (body._hp) return new Response(null, { status: 200 });

	if (!name || typeof name !== "string" || name.trim().length < 1 || name.trim().length > 100) {
		return new Response(JSON.stringify({ error: "name required (1–100 chars)" }), { status: 422, headers: JSON_HEADERS });
	}
	const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
		return new Response(JSON.stringify({ error: "valid email required" }), { status: 422, headers: JSON_HEADERS });
	}
	if (!message || typeof message !== "string" || message.trim().length < 10 || message.trim().length > 4000) {
		return new Response(JSON.stringify({ error: "message required (10–4000 chars)" }), { status: 422, headers: JSON_HEADERS });
	}

	if (env.TURNSTILE_SECRET) {
		if (!turnstileToken) {
			return new Response(JSON.stringify({ error: "Turnstile token required" }), { status: 422, headers: JSON_HEADERS });
		}
		const ip = request.headers.get("CF-Connecting-IP") ?? "";
		const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ secret: env.TURNSTILE_SECRET, response: turnstileToken, remoteip: ip }),
		});
		const verifyData = await verifyRes.json();
		if (!verifyData.success) {
			return new Response(JSON.stringify({ error: "Turnstile verification failed" }), { status: 422, headers: JSON_HEADERS });
		}
	}

	if (env.RATE_LIMIT) {
		const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
		const hourKey = `msg:${ip}:${Math.floor(Date.now() / 3_600_000)}`;
		const countStr = await env.RATE_LIMIT.get(hourKey);
		const count = parseInt(countStr ?? "0", 10);
		if (count >= 5) {
			return new Response(JSON.stringify({ error: "rate limit exceeded" }), { status: 429, headers: JSON_HEADERS });
		}
		await env.RATE_LIMIT.put(hourKey, String(count + 1), { expirationTtl: 7200 });
	}

	if (!env.RESEND_API_KEY) {
		return new Response(JSON.stringify({ error: "not_configured" }), { status: 503, headers: JSON_HEADERS });
	}

	if (!env.CONTACT_TO) {
		return new Response(JSON.stringify({ error: "not_configured" }), { status: 503, headers: JSON_HEADERS });
	}

	const resendRes = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${env.RESEND_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			from: "finnxiii.dev <noreply@finnxiii.dev>",
			to: [env.CONTACT_TO],
			reply_to: email.trim(),
			subject: `Message from ${name.trim()} via finnxiii.dev`,
			text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
		}),
	});

	if (!resendRes.ok) {
		return new Response(JSON.stringify({ error: "send failed" }), { status: 503, headers: JSON_HEADERS });
	}

	return new Response(JSON.stringify({ ok: true }), { status: 202, headers: JSON_HEADERS });
}

// Minimal HMAC-SHA256 JWT for Cloudflare Workers/Pages runtime.
// Uses the Web Crypto API — no npm deps needed.

function uint8ToBase64url(bytes) {
	let binary = "";
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64urlToUint8(str) {
	const padded = str.replace(/-/g, "+").replace(/_/g, "/");
	const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
	const binary = atob(padded + pad);
	return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function getHmacKey(secret) {
	return crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign", "verify"]
	);
}

export async function signJWT(payload, secret, expiresInSeconds = 28800) {
	const header = uint8ToBase64url(new TextEncoder().encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
	const body = uint8ToBase64url(
		new TextEncoder().encode(
			JSON.stringify({
				...payload,
				iat: Math.floor(Date.now() / 1000),
				exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
			})
		)
	);
	const data = `${header}.${body}`;
	const key = await getHmacKey(secret);
	const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
	return `${data}.${uint8ToBase64url(new Uint8Array(sig))}`;
}

export async function verifyJWT(token, secret) {
	const parts = token.split(".");
	if (parts.length !== 3) return null;

	const [header, body, sig] = parts;
	const data = `${header}.${body}`;
	const key = await getHmacKey(secret);

	const valid = await crypto.subtle.verify(
		"HMAC",
		key,
		base64urlToUint8(sig),
		new TextEncoder().encode(data)
	);
	if (!valid) return null;

	try {
		const payload = JSON.parse(
			new TextDecoder().decode(base64urlToUint8(body))
		);
		if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;
		return payload;
	} catch {
		return null;
	}
}

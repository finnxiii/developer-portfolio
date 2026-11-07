import { createRemoteJWKSet, jwtVerify } from "jose";

export async function onRequest(context) {
	const { request, env, next } = context;

	if (env.DEV_BYPASS_ACCESS === "true") {
		context.data.user = "dev@local";
		return next();
	}

	const jwt = request.headers.get("Cf-Access-Jwt-Assertion");
	if (!jwt) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
			headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
		});
	}

	try {
		const JWKS = createRemoteJWKSet(new URL(`${env.ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs`));
		const { payload } = await jwtVerify(jwt, JWKS, {
			issuer: env.ACCESS_TEAM_DOMAIN,
			audience: env.ACCESS_AUD,
		});
		context.data.user = payload.email;
		return next();
	} catch {
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
			headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
		});
	}
}

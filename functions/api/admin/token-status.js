const JSON_HEADERS = { "Content-Type": "application/json", "Cache-Control": "no-store" };

const BASE_HEADERS = {
	"X-GitHub-Api-Version": "2022-11-28",
	"User-Agent": "finnxiii-portfolio-cms/1.0",
	Accept: "application/vnd.github+json",
};

function parseDaysLeft(expiresAt) {
	if (!expiresAt) return null;
	return Math.floor((new Date(expiresAt).getTime() - Date.now()) / 86400000);
}

function deriveState({ tokenPresent, authenticated, repoAccess, contentsWrite, actionsRead, daysLeft }) {
	if (!tokenPresent) return "missing";
	if (daysLeft !== null && daysLeft < 0) return "expired";
	if (!authenticated) return "invalid";
	if (!repoAccess || !contentsWrite || !actionsRead) return "critical";
	if (daysLeft !== null && daysLeft < 7) return "critical";
	if (daysLeft !== null && daysLeft < 30) return "warning";
	return "ok";
}

export async function onRequestGet(context) {
	const { env } = context;

	if (!env.GITHUB_TOKEN) {
		return new Response(JSON.stringify({
			state: "missing",
			expiresAt: null,
			daysLeft: null,
			checks: { tokenPresent: false, authenticated: false, repoAccess: false, contentsWrite: false, actionsRead: false },
			rateLimit: null,
			repo: env.GITHUB_REPO ?? null,
			checkedAt: new Date().toISOString(),
		}), { headers: JSON_HEADERS });
	}

	const authHeaders = { ...BASE_HEADERS, Authorization: `Bearer ${env.GITHUB_TOKEN}` };
	const repoBase = `https://api.github.com/repos/${env.GITHUB_REPO}`;

	const [repoResult, actionsResult, rateLimitResult] = await Promise.allSettled([
		fetch(repoBase, { headers: authHeaders }),
		fetch(`${repoBase}/actions/runs?per_page=1`, { headers: authHeaders }),
		fetch("https://api.github.com/rate_limit", { headers: authHeaders }),
	]);

	let authenticated = false;
	let repoAccess = false;
	let contentsWrite = false;
	let expiresAt = null;

	if (repoResult.status === "fulfilled") {
		const repoRes = repoResult.value;
		if (repoRes.status !== 401) authenticated = true;
		if (repoRes.ok) {
			repoAccess = true;
			const expHeader = repoRes.headers.get("github-authentication-token-expiration");
			if (expHeader) {
				// "2027-11-07 00:00:00 UTC" → "2027-11-07T00:00:00Z"
				expiresAt = new Date(expHeader.replace(" ", "T").replace(" UTC", "Z")).toISOString();
			}
			try {
				const body = await repoRes.json();
				contentsWrite = body.permissions?.push === true;
			} catch { /* ignore */ }
		}
	}

	let actionsRead = false;
	if (actionsResult.status === "fulfilled" && actionsResult.value.ok) {
		actionsRead = true;
	}

	let rateLimit = null;
	if (rateLimitResult.status === "fulfilled" && rateLimitResult.value.ok) {
		try {
			const rl = await rateLimitResult.value.json();
			rateLimit = {
				remaining: rl.resources.core.remaining,
				limit: rl.resources.core.limit,
				resetAt: new Date(rl.resources.core.reset * 1000).toISOString(),
			};
		} catch { /* ignore */ }
	}

	const daysLeft = parseDaysLeft(expiresAt);
	const checks = { tokenPresent: true, authenticated, repoAccess, contentsWrite, actionsRead };
	const state = deriveState({ ...checks, daysLeft });

	return new Response(JSON.stringify({
		state,
		expiresAt,
		daysLeft,
		checks,
		rateLimit,
		repo: env.GITHUB_REPO,
		checkedAt: new Date().toISOString(),
	}), { headers: JSON_HEADERS });
}

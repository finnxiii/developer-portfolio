import { makeGitHubClient } from "../../_lib/github.js";

const JSON_HEADERS = { "Content-Type": "application/json", "Cache-Control": "no-store" };

export async function onRequestGet(context) {
	const { env } = context;
	try {
		const github = makeGitHubClient(env);
		const history = await github.getHistory();
		return new Response(JSON.stringify(history), { headers: JSON_HEADERS });
	} catch {
		return new Response(JSON.stringify({ error: "Failed to fetch history" }), {
			status: 502,
			headers: JSON_HEADERS,
		});
	}
}

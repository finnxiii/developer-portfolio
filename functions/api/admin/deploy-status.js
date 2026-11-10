import { makeGitHubClient } from "../../_lib/github.js";

const JSON_HEADERS = { "Content-Type": "application/json", "Cache-Control": "no-store" };

export async function onRequestGet(context) {
	const { request, env } = context;
	const sha = new URL(request.url).searchParams.get("sha");

	if (!sha) {
		return new Response(JSON.stringify({ error: "sha is required" }), {
			status: 400,
			headers: JSON_HEADERS,
		});
	}

	try {
		const github = makeGitHubClient(env);
		const status = await github.getActionsRunForSha(sha);
		if (!status) {
			return new Response(JSON.stringify({ status: "no_workflow", conclusion: null, url: null }), {
				headers: JSON_HEADERS,
			});
		}
		return new Response(JSON.stringify(status), { headers: JSON_HEADERS });
	} catch {
		return new Response(JSON.stringify({ error: "Failed to fetch deploy status" }), {
			status: 502,
			headers: JSON_HEADERS,
		});
	}
}

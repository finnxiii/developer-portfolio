import { validateContent } from "../../../src/content/schema.js";
import { makeGitHubClient } from "../../_lib/github.js";

const JSON_HEADERS = { "Content-Type": "application/json", "Cache-Control": "no-store" };

export async function onRequestGet(context) {
	const { env } = context;
	try {
		const github = makeGitHubClient(env);
		const { content, sha } = await github.getFile();
		return new Response(JSON.stringify({ content, sha }), { headers: JSON_HEADERS });
	} catch {
		return new Response(JSON.stringify({ error: "Failed to fetch content" }), {
			status: 502,
			headers: JSON_HEADERS,
		});
	}
}

export async function onRequestPost(context) {
	const { request, env } = context;

	let body;
	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({ error: "Invalid JSON" }), {
			status: 400,
			headers: JSON_HEADERS,
		});
	}

	const { content, sha, message } = body;
	if (!content || !sha || !message) {
		return new Response(JSON.stringify({ error: "content, sha, and message are required" }), {
			status: 400,
			headers: JSON_HEADERS,
		});
	}

	let parsed;
	try {
		parsed = JSON.parse(content);
	} catch {
		return new Response(JSON.stringify({ error: "content is not valid JSON" }), {
			status: 422,
			headers: JSON_HEADERS,
		});
	}

	parsed = { ...parsed, meta: { ...parsed.meta, lastUpdated: new Date().toISOString() } };

	const validation = validateContent(parsed);
	if (!validation.ok) {
		return new Response(JSON.stringify({ errors: validation.errors }), {
			status: 422,
			headers: JSON_HEADERS,
		});
	}

	const finalContent = JSON.stringify(parsed, null, "\t") + "\n";
	const github = makeGitHubClient(env);

	let result;
	try {
		result = await github.putFile({ content: finalContent, sha, message });
	} catch {
		return new Response(JSON.stringify({ error: "Failed to write to GitHub" }), {
			status: 502,
			headers: JSON_HEADERS,
		});
	}

	if (result.conflict) {
		return new Response(JSON.stringify({ error: "Content changed since you loaded it" }), {
			status: 409,
			headers: JSON_HEADERS,
		});
	}

	return new Response(
		JSON.stringify({ commitSha: result.commitSha, commitUrl: result.commitUrl }),
		{ headers: JSON_HEADERS },
	);
}

import { validateContent } from "../../../src/content/schema.js";
import { makeGitHubClient } from "../../_lib/github.js";

const JSON_HEADERS = { "Content-Type": "application/json", "Cache-Control": "no-store" };

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

	const { commitSha } = body;
	if (!commitSha) {
		return new Response(JSON.stringify({ error: "commitSha is required" }), {
			status: 400,
			headers: JSON_HEADERS,
		});
	}

	const github = makeGitHubClient(env);

	let oldContent;
	try {
		oldContent = await github.getFileAtCommit(commitSha);
	} catch {
		return new Response(JSON.stringify({ error: "Failed to fetch file at that commit" }), {
			status: 502,
			headers: JSON_HEADERS,
		});
	}

	let parsed;
	try {
		parsed = JSON.parse(oldContent);
	} catch {
		return new Response(JSON.stringify({ error: "File at that commit is not valid JSON" }), {
			status: 422,
			headers: JSON_HEADERS,
		});
	}

	const validation = validateContent(parsed);
	if (!validation.ok) {
		return new Response(JSON.stringify({ errors: validation.errors }), {
			status: 422,
			headers: JSON_HEADERS,
		});
	}

	let currentSha;
	try {
		({ sha: currentSha } = await github.getFile());
	} catch {
		return new Response(JSON.stringify({ error: "Failed to fetch current file sha" }), {
			status: 502,
			headers: JSON_HEADERS,
		});
	}

	const finalContent = JSON.stringify(parsed, null, "\t") + "\n";
	const shortSha = commitSha.slice(0, 7);

	let result;
	try {
		result = await github.putFile({
			content: finalContent,
			sha: currentSha,
			message: `restore from ${shortSha}`,
		});
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

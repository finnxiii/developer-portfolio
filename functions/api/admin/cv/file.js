import { makeGitHubClient } from "../../../_lib/github.js";

export async function onRequestGet(context) {
	const { request, env } = context;
	const CV_PATH = env.CV_PATH ?? "public/NaingHtooLwin-CV.pdf";
	const url = new URL(request.url);
	const ref = url.searchParams.get("ref") || env.GITHUB_BRANCH;

	const is40Hex = /^[0-9a-f]{40}$/i.test(ref);
	const isBranch = ref === env.GITHUB_BRANCH;

	if (!is40Hex && !isBranch) {
		return new Response(JSON.stringify({ error: "Invalid ref" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	const github = makeGitHubClient(env);
	let buffer;
	try {
		buffer = await github.getFileRaw(CV_PATH, ref);
	} catch (err) {
		const status = err.status === 404 ? 404 : 502;
		const msg = err.status === 404 ? "CV not found" : "Failed to fetch CV";
		return new Response(JSON.stringify({ error: msg }), {
			status,
			headers: { "Content-Type": "application/json" },
		});
	}

	return new Response(buffer, {
		headers: {
			"Content-Type": "application/pdf",
			"Cache-Control": "no-store",
		},
	});
}

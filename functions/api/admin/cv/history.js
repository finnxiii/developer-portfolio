import { makeGitHubClient } from "../../../_lib/github.js";

const JSON_HEADERS = { "Content-Type": "application/json", "Cache-Control": "no-store" };

function extractCvNote(message) {
	const match = message.match(/\nCV:\s*(.+?)(?:\n|$)/i);
	return match ? match[1].trim() : "";
}

export async function onRequestGet(context) {
	const { env } = context;
	const CV_PATH = env.CV_PATH ?? "public/NaingHtooLwin-CV.pdf";

	try {
		const github = makeGitHubClient(env);
		const commits = await github.getPathHistory(CV_PATH, 20);

		const history = commits.map((c) => ({
			sha: c.sha,
			date: c.date,
			message: c.message.split("\n")[0],
			note: extractCvNote(c.message),
			url: c.url,
		}));

		return new Response(JSON.stringify(history), { headers: JSON_HEADERS });
	} catch {
		return new Response(JSON.stringify({ error: "Failed to fetch CV history" }), {
			status: 502,
			headers: JSON_HEADERS,
		});
	}
}

import { validateContent } from "../../../src/content/schema.js";
import { makeGitHubClient } from "../../_lib/github.js";

const JSON_HEADERS = { "Content-Type": "application/json", "Cache-Control": "no-store" };

function isPdf(bytes) {
	return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2D;
}

export async function onRequestPost(context) {
	const { request, env } = context;

	let body;
	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: JSON_HEADERS });
	}

	const { message, content, cv } = body;

	if (!content && !cv) {
		return new Response(JSON.stringify({ error: "Nothing to publish" }), { status: 400, headers: JSON_HEADERS });
	}

	if (!message || !message.trim()) {
		return new Response(JSON.stringify({ error: "Commit message is required" }), { status: 400, headers: JSON_HEADERS });
	}

	const CV_PATH = env.CV_PATH ?? "public/NaingHtooLwin-CV.pdf";
	const github = makeGitHubClient(env);

	let branchHead;
	try {
		branchHead = await github.getBranchHead();
	} catch {
		return new Response(JSON.stringify({ error: "Failed to fetch branch head" }), { status: 502, headers: JSON_HEADERS });
	}

	const entries = [];
	const files = [];
	let commitMessage = message.trim();

	if (content) {
		const { json: jsonStr, baseSha } = content;

		let parsed;
		try {
			parsed = JSON.parse(jsonStr);
		} catch {
			return new Response(JSON.stringify({ error: "content.json is not valid JSON" }), { status: 422, headers: JSON_HEADERS });
		}

		if (!parsed.meta) parsed.meta = {};
		parsed.meta.lastUpdated = new Date().toISOString().slice(0, 10);

		const validation = validateContent(parsed);
		if (!validation.ok) {
			return new Response(JSON.stringify({ errors: validation.errors }), { status: 422, headers: JSON_HEADERS });
		}

		let currentBlobSha;
		try {
			currentBlobSha = await github.getBlobShaAtHead(env.CONTENT_PATH);
		} catch {
			return new Response(JSON.stringify({ error: "Failed to check content sha" }), { status: 502, headers: JSON_HEADERS });
		}

		if (baseSha !== currentBlobSha) {
			return new Response(JSON.stringify({ error: "content_changed" }), { status: 409, headers: JSON_HEADERS });
		}

		const finalContent = JSON.stringify(parsed, null, "\t") + "\n";

		let blobSha;
		try {
			blobSha = await github.createBlob({ content: finalContent, encoding: "utf-8" });
		} catch {
			return new Response(JSON.stringify({ error: "Failed to create content blob" }), { status: 502, headers: JSON_HEADERS });
		}

		entries.push({ path: env.CONTENT_PATH, sha: blobSha });
		files.push(env.CONTENT_PATH);
	}

	if (cv) {
		const { base64: cvBase64, note, filename: _filename } = cv;

		if (!note || note.trim().length === 0) {
			return new Response(JSON.stringify({ error: "CV note is required" }), { status: 400, headers: JSON_HEADERS });
		}
		if (note.length > 200) {
			return new Response(JSON.stringify({ error: "CV note must be under 200 characters" }), { status: 400, headers: JSON_HEADERS });
		}

		let cvBytes;
		try {
			const binary = atob(cvBase64);
			cvBytes = new Uint8Array(binary.length);
			for (let i = 0; i < binary.length; i++) cvBytes[i] = binary.charCodeAt(i);
		} catch {
			return new Response(JSON.stringify({ error: "Invalid base64 for CV" }), { status: 400, headers: JSON_HEADERS });
		}

		if (cvBytes.length > 5 * 1024 * 1024) {
			return new Response(JSON.stringify({ error: "CV exceeds 5 MB" }), { status: 413, headers: JSON_HEADERS });
		}

		if (!isPdf(cvBytes)) {
			return new Response(JSON.stringify({ error: "File must be a PDF" }), { status: 415, headers: JSON_HEADERS });
		}

		let cvBlobSha;
		try {
			cvBlobSha = await github.createBlob({ content: cvBase64, encoding: "base64" });
		} catch {
			return new Response(JSON.stringify({ error: "Failed to create CV blob" }), { status: 502, headers: JSON_HEADERS });
		}

		entries.push({ path: CV_PATH, sha: cvBlobSha });
		files.push(CV_PATH);
		commitMessage += `\n\nCV: ${note.trim()}`;
	}

	let treeSha;
	try {
		treeSha = await github.createTree({ baseTree: branchHead.treeSha, entries });
	} catch {
		return new Response(JSON.stringify({ error: "Failed to create tree" }), { status: 502, headers: JSON_HEADERS });
	}

	let commitResult;
	try {
		commitResult = await github.createCommit({
			message: commitMessage,
			tree: treeSha,
			parents: [branchHead.commitSha],
		});
	} catch {
		return new Response(JSON.stringify({ error: "Failed to create commit" }), { status: 502, headers: JSON_HEADERS });
	}

	let refResult;
	try {
		refResult = await github.updateRef(commitResult.sha);
	} catch {
		return new Response(JSON.stringify({ error: "Failed to update branch ref" }), { status: 502, headers: JSON_HEADERS });
	}

	if (refResult.nonFastForward) {
		return new Response(JSON.stringify({ error: "branch_moved" }), { status: 409, headers: JSON_HEADERS });
	}

	return new Response(
		JSON.stringify({ commitSha: commitResult.sha, commitUrl: commitResult.url, files }),
		{ headers: JSON_HEADERS },
	);
}

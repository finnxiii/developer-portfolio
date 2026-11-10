function base64Encode(str) {
	const bytes = new TextEncoder().encode(str);
	let binary = "";
	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary);
}

function base64Decode(b64) {
	const binary = atob(b64.replace(/\s/g, ""));
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return new TextDecoder().decode(bytes);
}

export function makeGitHubClient(env) {
	const baseHeaders = {
		Authorization: `Bearer ${env.GITHUB_TOKEN}`,
		"X-GitHub-Api-Version": "2022-11-28",
		"User-Agent": "finnxiii-portfolio-cms/1.0",
		"Content-Type": "application/json",
	};

	const repoBase = `https://api.github.com/repos/${env.GITHUB_REPO}`;

	async function getFile() {
		const res = await fetch(
			`${repoBase}/contents/${env.CONTENT_PATH}?ref=${env.GITHUB_BRANCH}`,
			{ headers: baseHeaders },
		);
		if (!res.ok) throw Object.assign(new Error("GitHub API error"), { status: res.status });
		const json = await res.json();
		return { content: base64Decode(json.content), sha: json.sha };
	}

	async function getFileAtCommit(commitSha) {
		const res = await fetch(
			`${repoBase}/contents/${env.CONTENT_PATH}?ref=${commitSha}`,
			{ headers: baseHeaders },
		);
		if (!res.ok) throw Object.assign(new Error("GitHub API error"), { status: res.status });
		const json = await res.json();
		return base64Decode(json.content);
	}

	async function putFile({ content, sha, message }) {
		const res = await fetch(`${repoBase}/contents/${env.CONTENT_PATH}`, {
			method: "PUT",
			headers: baseHeaders,
			body: JSON.stringify({
				message: `content: ${message}`,
				content: base64Encode(content),
				sha,
				branch: env.GITHUB_BRANCH,
				author: { name: "Naing Htoo Lwin", email: "nainghtoolwin1385@gmail.com" },
				committer: { name: "Naing Htoo Lwin", email: "nainghtoolwin1385@gmail.com" },
			}),
		});
		if (res.status === 409 || res.status === 422) return { conflict: true };
		if (!res.ok) throw Object.assign(new Error("GitHub API error"), { status: res.status });
		const json = await res.json();
		return { conflict: false, commitSha: json.commit.sha, commitUrl: json.commit.html_url };
	}

	async function getHistory() {
		const res = await fetch(
			`${repoBase}/commits?path=${env.CONTENT_PATH}&sha=${env.GITHUB_BRANCH}&per_page=20`,
			{ headers: baseHeaders },
		);
		if (!res.ok) throw Object.assign(new Error("GitHub API error"), { status: res.status });
		const commits = await res.json();
		return commits.map((c) => ({
			sha: c.sha,
			message: c.commit.message,
			date: c.commit.author.date,
			url: c.html_url,
		}));
	}

	async function getActionsRunForSha(sha) {
		const res = await fetch(
			`${repoBase}/actions/runs?head_sha=${sha}&per_page=1`,
			{ headers: baseHeaders },
		);
		if (!res.ok) throw Object.assign(new Error("GitHub API error"), { status: res.status });
		const json = await res.json();
		const run = json.workflow_runs?.[0];
		if (!run) return null;
		return { status: run.status, conclusion: run.conclusion, url: run.html_url };
	}

	async function getBranchHead() {
		const refRes = await fetch(`${repoBase}/git/ref/heads/${env.GITHUB_BRANCH}`, { headers: baseHeaders });
		if (!refRes.ok) throw Object.assign(new Error("GitHub API error"), { status: refRes.status });
		const commitSha = (await refRes.json()).object.sha;

		const commitRes = await fetch(`${repoBase}/git/commits/${commitSha}`, { headers: baseHeaders });
		if (!commitRes.ok) throw Object.assign(new Error("GitHub API error"), { status: commitRes.status });
		const treeSha = (await commitRes.json()).tree.sha;

		return { commitSha, treeSha };
	}

	async function getBlobShaAtHead(path) {
		const { treeSha } = await getBranchHead();
		const res = await fetch(`${repoBase}/git/trees/${treeSha}?recursive=1`, { headers: baseHeaders });
		if (!res.ok) throw Object.assign(new Error("GitHub API error"), { status: res.status });
		const { tree } = await res.json();
		return tree.find((f) => f.path === path)?.sha ?? null;
	}

	async function createBlob({ content, encoding = "utf-8" }) {
		const res = await fetch(`${repoBase}/git/blobs`, {
			method: "POST",
			headers: baseHeaders,
			body: JSON.stringify({ content, encoding }),
		});
		if (!res.ok) throw Object.assign(new Error("GitHub API error"), { status: res.status });
		return (await res.json()).sha;
	}

	async function createTree({ baseTree, entries }) {
		const res = await fetch(`${repoBase}/git/trees`, {
			method: "POST",
			headers: baseHeaders,
			body: JSON.stringify({
				base_tree: baseTree,
				tree: entries.map((e) => ({ path: e.path, mode: "100644", type: "blob", sha: e.sha })),
			}),
		});
		if (!res.ok) throw Object.assign(new Error("GitHub API error"), { status: res.status });
		return (await res.json()).sha;
	}

	async function createCommit({ message, tree, parents }) {
		const author = { name: "Naing Htoo Lwin", email: "nainghtoolwin1385@gmail.com" };
		const res = await fetch(`${repoBase}/git/commits`, {
			method: "POST",
			headers: baseHeaders,
			body: JSON.stringify({ message, tree, parents, author, committer: author }),
		});
		if (!res.ok) throw Object.assign(new Error("GitHub API error"), { status: res.status });
		const json = await res.json();
		return { sha: json.sha, url: `https://github.com/${env.GITHUB_REPO}/commit/${json.sha}` };
	}

	async function updateRef(commitSha) {
		const res = await fetch(`${repoBase}/git/refs/heads/${env.GITHUB_BRANCH}`, {
			method: "PATCH",
			headers: baseHeaders,
			body: JSON.stringify({ sha: commitSha, force: false }),
		});
		if (res.status === 422) return { nonFastForward: true };
		if (!res.ok) throw Object.assign(new Error("GitHub API error"), { status: res.status });
		return { nonFastForward: false };
	}

	async function getFileRaw(path, ref) {
		const res = await fetch(
			`${repoBase}/contents/${path}?ref=${encodeURIComponent(ref)}`,
			{ headers: { ...baseHeaders, Accept: "application/vnd.github.raw" } },
		);
		if (!res.ok) throw Object.assign(new Error("GitHub API error"), { status: res.status });
		return res.arrayBuffer();
	}

	async function getPathHistory(path, perPage = 20) {
		const res = await fetch(
			`${repoBase}/commits?path=${encodeURIComponent(path)}&sha=${env.GITHUB_BRANCH}&per_page=${perPage}`,
			{ headers: baseHeaders },
		);
		if (!res.ok) throw Object.assign(new Error("GitHub API error"), { status: res.status });
		return (await res.json()).map((c) => ({
			sha: c.sha,
			date: c.commit.author.date,
			message: c.commit.message,
			url: c.html_url,
		}));
	}

	return {
		getFile, getFileAtCommit, putFile, getHistory, getActionsRunForSha,
		getBranchHead, getBlobShaAtHead, createBlob, createTree, createCommit,
		updateRef, getFileRaw, getPathHistory,
	};
}

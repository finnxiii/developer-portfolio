import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useDraftCtx } from "./useDraftCtx";
import { useCvStagedCtx } from "./useCvStagedCtx";
import { useQuack } from "../../components/quack/QuackContext";
import { computeAllStagedDiff } from "./draft/diff";
import { validateContent } from "../../content/schema";

const STEPS = [
	"Commit to main",
	"GitHub Actions build",
	"Cloudflare Pages deploy",
	"Live on finnxiii.dev",
];

const POLL_INTERVAL = 5000;
const POLL_TIMEOUT = 6 * 60 * 1000;

// ---- Word-level diff ----
function wordDiff(before, after) {
	if (!before && !after) return [];
	if (!before) return [{ text: after, type: "add" }];
	if (!after) return [{ text: before, type: "del" }];
	if (before === after) return [{ text: before, type: "same" }];

	const a = before.split(/\b/);
	const b = after.split(/\b/);
	const m = a.length, n = b.length;
	const dp = Array.from({ length: m + 1 }, () => new Uint16Array(n + 1));
	for (let i = m - 1; i >= 0; i--) {
		for (let j = n - 1; j >= 0; j--) {
			if (a[i] === b[j]) dp[i][j] = dp[i + 1][j + 1] + 1;
			else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
		}
	}
	const result = [];
	let i = 0, j = 0;
	while (i < m || j < n) {
		if (i < m && j < n && a[i] === b[j]) {
			result.push({ text: a[i], type: "same" }); i++; j++;
		} else if (j < n && (i >= m || dp[i][j + 1] >= dp[i + 1][j])) {
			result.push({ text: b[j], type: "add" }); j++;
		} else {
			result.push({ text: a[i], type: "del" }); i++;
		}
	}
	return result;
}

function InlineDiff({ before, after }) {
	if (!before && !after) return null;
	if (before === null || before === undefined) {
		return <span className="adm-pub-ins">{String(after)}</span>;
	}
	if (after === null || after === undefined) {
		return <del className="adm-pub-del">{String(before)}</del>;
	}
	const tokens = wordDiff(String(before), String(after));
	return (
		<span>
			{tokens.map((t, idx) =>
				t.type === "del" ? <del key={idx} className="adm-pub-del">{t.text}</del> :
				t.type === "add" ? <ins key={idx} className="adm-pub-ins">{t.text}</ins> :
				<span key={idx}>{t.text}</span>
			)}
		</span>
	);
}

// ---- Paper mock (CV thumbnail) ----
function PaperMock({ dim = false, highlighted = false }) {
	return (
		<div
			className={"adm-cv-paper" + (highlighted ? " adm-cv-paper--highlight" : "")}
			style={{ opacity: dim ? 0.5 : 1 }}
			aria-hidden="true"
		>
			{Array.from({ length: 14 }, (_, i) => (
				<i key={i} className={
					"adm-cv-paper__line" +
					(i === 0 ? " adm-cv-paper__line--title" : "") +
					(i === 2 ? " adm-cv-paper__line--rule" : "")
				} />
			))}
		</div>
	);
}

// ---- Convert blob to base64 ----
function blobToBase64(blob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result.split(",")[1]);
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
}

// ---- Default commit message ----
function buildDefaultMsg(staged, cvStaged) {
	const parts = [];
	if (staged.size > 0) parts.push(`content: update ${[...staged].join(", ")}`);
	if (cvStaged) parts.push(`new CV`);
	return parts.join(", ");
}

// ---- Run client-side checks ----
function runChecks(draft, staged, cvStaged) {
	const checks = [];

	if (staged.size > 0 && draft) {
		const v = validateContent(draft);
		checks.push({ label: "Content is valid JSON", pass: true });
		checks.push({ label: "Required fields present", pass: v.ok, error: v.ok ? null : v.errors?.join(", ") });

		const projects = draft?.projects ?? [];
		const longDecks = projects.filter((p) => (p.deck ?? "").length > 220);
		checks.push({
			label: "Project decks ≤ 220 chars",
			pass: longDecks.length === 0,
			error: longDecks.length ? longDecks.map((p) => p.slug).join(", ") : null,
		});
	}

	if (cvStaged) {
		checks.push({ label: `CV is a PDF under 5 MB (${(cvStaged.size / 1024).toFixed(0)} KB)`, pass: cvStaged.size <= 5 * 1024 * 1024 });
	}

	return checks;
}

export default function AdminPublish() {
	const { base, baseSha, draft, staged, stagedCount, unstageSection, restoreDraft, reload } = useDraftCtx();
	const { cvStaged, unstageCv } = useCvStagedCtx();
	const { say } = useQuack();

	const totalStaged = stagedCount + (cvStaged ? 1 : 0);
	const changes = computeAllStagedDiff(base, draft, staged);

	const [commitMsg, setCommitMsg] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [publishError, setPublishError] = useState(null);
	const [conflictType, setConflictType] = useState(null); // "content_changed" | "branch_moved"

	// Deploy steps state
	const [phase, setPhase] = useState("idle"); // "idle" | "deploying" | "done" | "failed"
	const [step, setStep] = useState(0);
	const [deployError, setDeployError] = useState(null);
	const [commitSha, setCommitSha] = useState(null);

	// History
	const [history, setHistory] = useState(null);
	const [histLoading, setHistLoading] = useState(true);
	const [restoringCommit, setRestoringCommit] = useState(null);
	const [restoreMsg, setRestoreMsg] = useState(null);

	const pollRef = useRef(null);
	const pollStartRef = useRef(null);

	// Set default commit message when staged changes
	useEffect(() => {
		setCommitMsg(buildDefaultMsg(staged, cvStaged));
	}, [staged, cvStaged]);

	// Fetch history
	useEffect(() => {
		fetch("/api/admin/history")
			.then((r) => r.ok ? r.json() : null)
			.then((d) => { if (d) setHistory(d); })
			.catch(() => {})
			.finally(() => setHistLoading(false));
	}, []);

	// Stop polling when tab is hidden
	useEffect(() => {
		const handler = () => {
			if (document.hidden && pollRef.current) {
				clearInterval(pollRef.current);
				pollRef.current = null;
			}
		};
		document.addEventListener("visibilitychange", handler);
		return () => document.removeEventListener("visibilitychange", handler);
	}, []);

	const startPolling = useCallback((sha) => {
		pollStartRef.current = Date.now();

		const poll = async () => {
			if (Date.now() - pollStartRef.current > POLL_TIMEOUT) {
				clearInterval(pollRef.current);
				pollRef.current = null;
				return;
			}

			try {
				const res = await fetch(`/api/admin/deploy-status?sha=${sha}`);
				if (!res.ok) return;
				const data = await res.json();

				if (data.status === "no_workflow") return; // still waiting for workflow

				if (data.status === "completed") {
					clearInterval(pollRef.current);
					pollRef.current = null;
					if (data.conclusion === "success") {
						setStep(STEPS.length);
						setPhase("done");
						say("Shipped! Quack quack.");
					} else {
						setDeployError(`Build ${data.conclusion ?? "failed"}.`);
						setPhase("failed");
					}
				} else {
					// in_progress or queued
					setStep(2);
				}
			} catch { /* ignore */ }
		};

		poll();
		pollRef.current = setInterval(poll, POLL_INTERVAL);
	}, [say]);

	// Cleanup polling on unmount
	useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

	const handlePublish = useCallback(async () => {
		if (submitting) return;
		setSubmitting(true);
		setPublishError(null);
		setConflictType(null);
		setDeployError(null);

		try {
			const payload = { message: commitMsg.trim() };

			if (staged.size > 0 && draft) {
				payload.content = { json: JSON.stringify(draft), baseSha };
			}

			if (cvStaged) {
				const base64 = await blobToBase64(cvStaged.blob);
				payload.cv = { base64, note: cvStaged.note, filename: cvStaged.filename };
			}

			const res = await fetch("/api/admin/publish", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			const data = await res.json();

			if (!res.ok) {
				if (res.status === 409) {
					setConflictType(data.error);
				} else if (res.status === 422) {
					setPublishError("Validation failed: " + (data.errors ?? [data.error]).join("; "));
				} else {
					setPublishError(data.error ?? `Error ${res.status}`);
				}
				setSubmitting(false);
				return;
			}

			// Success — clear staged state
			for (const key of staged) unstageSection(key);
			if (cvStaged) await unstageCv();

			setCommitSha(data.commitSha);
			setPhase("deploying");
			setStep(1);
			startPolling(data.commitSha);
		} catch (err) {
			setPublishError(err.message || "Network error");
			setSubmitting(false);
		}
	}, [submitting, commitMsg, staged, draft, baseSha, cvStaged, unstageSection, unstageCv, startPolling]);

	const handleRestore = useCallback(async (sha) => {
		setRestoringCommit(sha);
		setRestoreMsg(null);
		try {
			const res = await fetch("/api/admin/restore", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ commitSha: sha }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error ?? "Failed");
			restoreDraft(data.content);
			setRestoreMsg("Restored as draft. Stage sections and publish to go live.");
		} catch (err) {
			setRestoreMsg(`Error: ${err.message}`);
		} finally {
			setRestoringCommit(null);
		}
	}, [restoreDraft]);

	const checks = runChecks(draft, staged, cvStaged);
	const checksPass = checks.every((c) => c.pass);
	const canPublish = totalStaged > 0 && commitMsg.trim() && checksPass && !submitting && phase === "idle";

	const summary = totalStaged === 0
		? "Nothing staged."
		: `${totalStaged} file${totalStaged !== 1 ? "s" : ""} staged`;

	return (
		<div className="adm-wrap">
			<div className="adm-ov-head">
				<div>
					<span className="adm-ov-head__label">git diff --staged</span>
					<h1 className="adm-ov-head__h1">Review &amp; publish</h1>
				</div>
				<div className="adm-pub-head-right">
					<span className="adm-ov-head__live">{summary}</span>
					<a href="/?preview=draft" target="_blank" rel="noopener noreferrer"
						className="ae-btn ae-btn--sm">
						Preview site ↗
					</a>
				</div>
			</div>

			<div className="adm-pub-layout">
				{/* Left: staged items + history */}
				<div className="adm-pub-left">

					{/* Content diff card */}
					{staged.size > 0 && (
						<div className="adm-card adm-pub-diff-card">
							<div className="adm-pub-diff-hd">
								<span className="adm-pub-diff-hd__path">
									<span className="adm-pub-diff-hd__m">M</span>
									{" "}src/content/fallback.json
								</span>
								<button type="button" className="ae-btn ae-btn--sm"
									onClick={() => { for (const k of staged) unstageSection(k); }}>
									Unstage
								</button>
							</div>
							<div className="adm-pub-diff-body">
								{changes.length === 0 && (
									<p className="adm-pub-diff-empty">No field changes detected.</p>
								)}
								{changes.map((c, i) => (
									<div key={i} className="adm-pub-diff-row">
										<span className="adm-pub-diff-path">{c.path}</span>
										<div className="adm-pub-diff-inline">
											<InlineDiff before={c.before} after={c.after} />
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* CV card */}
					{cvStaged && (
						<div className="adm-card adm-pub-diff-card">
							<div className="adm-pub-diff-hd">
								<span className="adm-pub-diff-hd__path">
									<span className="adm-pub-diff-hd__m">M</span>
									{" "}public/NaingHtooLwin-CV.pdf
									<span className="adm-pub-diff-hd__binary"> · binary</span>
								</span>
								<button type="button" className="ae-btn ae-btn--sm" onClick={unstageCv}>
									Unstage
								</button>
							</div>
							<div className="adm-pub-cv-compare">
								<div className="adm-pub-cv-side">
									<span className="adm-pub-cv-label adm-pub-cv-label--before">before</span>
									<PaperMock dim />
								</div>
								<span className="adm-pub-cv-arrow" aria-hidden="true">→</span>
								<div className="adm-pub-cv-side">
									<span className="adm-pub-cv-label adm-pub-cv-label--after">
										after · {(cvStaged.size / 1024).toFixed(0)} KB
									</span>
									<PaperMock highlighted />
								</div>
								<div className="adm-pub-cv-info">
									<strong>"{cvStaged.note}"</strong>
									<span className="adm-note">
										{cvStaged.pages ? `${cvStaged.pages} pages · ` : ""}PDF · {cvStaged.filename}
									</span>
								</div>
							</div>
						</div>
					)}

					{/* Empty state */}
					{totalStaged === 0 && phase === "idle" && (
						<div className="adm-card adm-pub-empty">
							<span className="adm-pub-empty__title">Nothing staged.</span>
							<span className="adm-pub-empty__hint">
								<Link to="/admin/content/profile">Edit content →</Link>
								{" or "}
								<Link to="/admin/cv">upload a CV →</Link>
							</span>
						</div>
					)}

					{/* History */}
					<div className="adm-card adm-pub-history">
						<h2 className="adm-pub-history__h2">History</h2>
						{restoreMsg && <p className="adm-pub-restore-msg">{restoreMsg}</p>}
						{histLoading && <p className="adm-loading">Loading…</p>}
						{history && history.map((h) => (
							<div key={h.sha} className="adm-pub-history-row">
								<span className="adm-pub-history-dot" aria-hidden="true" />
								<div className="adm-pub-history-info">
									<span className="adm-pub-history-msg">{h.message}</span>
									<span className="adm-pub-history-meta">
										{new Date(h.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
									</span>
								</div>
								<button type="button" className="ae-btn ae-btn--sm"
									onClick={() => handleRestore(h.sha)}
									disabled={restoringCommit === h.sha}>
									{restoringCommit === h.sha ? "…" : "Restore"}
								</button>
							</div>
						))}
						{history && history.length === 0 && (
							<p className="adm-note">No commits yet.</p>
						)}
					</div>
				</div>

				{/* Right: checks + publish */}
				<aside className="adm-pub-right">
					{/* Checks */}
					{checks.length > 0 && (
						<div className="adm-card adm-pub-checks">
							<h2 className="adm-card__label">checks</h2>
							{checks.map((c, i) => (
								<div key={i} className={"adm-pub-check adm-pub-check--" + (c.pass ? "pass" : "fail")}>
									<span className="adm-pub-check__icon" aria-hidden="true">{c.pass ? "✓" : "✗"}</span>
									<span className="adm-pub-check__label">{c.label}</span>
									{c.error && <span className="adm-pub-check__err">{c.error}</span>}
								</div>
							))}
						</div>
					)}

					{/* Publish */}
					<div className="adm-card adm-pub-publish">
						<label className="ae-field">
							<span className="ae-label">Commit message</span>
							<input type="text"
								className="ae-input ae-input--mono"
								value={commitMsg}
								onChange={(e) => setCommitMsg(e.target.value)}
								disabled={phase !== "idle"}
							/>
						</label>

						{publishError && (
							<p className="ae-error adm-pub-error" role="alert">{publishError}</p>
						)}

						{conflictType === "content_changed" && (
							<div className="adm-pub-conflict" role="alert">
								<p>Content changed on the branch since you loaded it.</p>
								<button type="button" className="ae-btn ae-btn--sm" onClick={reload}>
									Reload published content
								</button>
							</div>
						)}

						{conflictType === "branch_moved" && (
							<p className="ae-error adm-pub-error" role="alert">
								Branch moved — another publish happened. Reload and try again.
							</p>
						)}

						<button
							type="button"
							className="ae-changes__stage adm-pub-btn"
							onClick={handlePublish}
							disabled={!canPublish}
							aria-busy={submitting}
						>
							{submitting ? "Publishing…" : phase === "done" ? "✓ Published" : "Publish"}
						</button>

						{/* Deploy steps */}
						{phase !== "idle" && (
							<ol className="adm-pub-steps">
								{STEPS.map((label, i) => {
									const done = i < step;
									const active = i === step && phase === "deploying";
									const failed = phase === "failed" && i === step;
									return (
										<li key={i} className={
											"adm-pub-step" +
											(done ? " adm-pub-step--done" : "") +
											(active ? " adm-pub-step--active" : "") +
											(failed ? " adm-pub-step--fail" : "")
										}>
											<span className="adm-pub-step__dot" aria-hidden="true">
												{done ? "✓" : active ? "·" : ""}
											</span>
											<span>{label}</span>
										</li>
									);
								})}
							</ol>
						)}

						{deployError && (
							<p className="ae-error adm-pub-error" role="alert">{deployError}</p>
						)}

						{phase === "done" && commitSha && (
							<a
								href={`https://finnxiii.dev`}
								target="_blank"
								rel="noopener noreferrer"
								className="adm-pub-live"
							>
								● live on finnxiii.dev ↗
							</a>
						)}
					</div>
				</aside>
			</div>
		</div>
	);
}

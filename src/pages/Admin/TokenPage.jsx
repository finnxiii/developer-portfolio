import { useState, useContext } from "react";
import { TokenStatusContext } from "./token-context";

function CopyButton({ value, label }) {
	const [copied, setCopied] = useState(false);

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(value);
		} catch {
			// Fallback for older browsers
			const el = document.createElement("textarea");
			el.value = value;
			el.style.cssText = "position:fixed;opacity:0;pointer-events:none;";
			document.body.appendChild(el);
			el.select();
			document.execCommand("copy");
			document.body.removeChild(el);
		}
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<button
			type="button"
			className="adm-copy-btn"
			onClick={copy}
			aria-label={`Copy ${label}`}
		>
			{copied ? "Copied!" : "Copy"}
		</button>
	);
}

const CHECK_DEFS = [
	{ key: "tokenPresent",   label: "Token present",    fail: "No GITHUB_TOKEN env variable is set — the admin CMS cannot call GitHub" },
	{ key: "authenticated",  label: "Authenticated",    fail: "GitHub returned 401 — token is invalid or revoked" },
	{ key: "repoAccess",     label: "Repo accessible",  fail: "Cannot read the repository — verify token scope and GITHUB_REPO setting" },
	{ key: "contentsWrite",  label: "Contents write",   fail: "Publish will fail — token needs Contents: Read and write permission" },
	{ key: "actionsRead",    label: "Actions read",     fail: "Deploy-status checks will fail — token needs Actions: Read-only permission" },
];

const BADGE_LABEL = { ok: "OK", warning: "Warning", critical: "Critical", expired: "Expired", invalid: "Invalid", missing: "Not configured" };

export default function TokenPage() {
	const { tokenStatus, checkToken } = useContext(TokenStatusContext);
	const [checking, setChecking] = useState(false);

	const recheck = async () => {
		setChecking(true);
		await checkToken();
		setChecking(false);
	};

	if (!tokenStatus) {
		return <main className="adm__content"><p className="adm-loading">Checking token…</p></main>;
	}

	const tokenName = `build-log-admin-${new Date().toISOString().slice(0, 7)}`;
	const repoShortName = tokenStatus.repo?.split("/")[1] ?? "developer-portfolio";

	const expiryLine = (() => {
		if (tokenStatus.daysLeft === null) return "Never expires";
		if (tokenStatus.daysLeft < 0) {
			const d = Math.abs(tokenStatus.daysLeft);
			return `Expired ${d} day${d !== 1 ? "s" : ""} ago`;
		}
		return `Expires in ${tokenStatus.daysLeft} day${tokenStatus.daysLeft !== 1 ? "s" : ""}`;
	})();

	const expiryFull = tokenStatus.expiresAt
		? new Date(tokenStatus.expiresAt).toLocaleDateString("en-GB", {
			weekday: "long", year: "numeric", month: "long", day: "numeric",
		})
		: null;

	const barWidth = tokenStatus.daysLeft === null
		? 100
		: Math.max(0, Math.min(100, (tokenStatus.daysLeft / 365) * 100));

	const isHighlighted = tokenStatus.state !== "ok";

	return (
		<main className="adm__content adm-token">

			{/* ── Status ──────────────────────────────────────────── */}
			<section>
				<div className="adm-token__row">
					<h2 className="adm-section__title">Token Status</h2>
					<div className="adm-token__actions">
						<span className="adm-token__checked">
							Checked {new Date(tokenStatus.checkedAt).toLocaleTimeString()}
						</span>
						<button className="adm-btn" onClick={recheck} disabled={checking}>
							{checking ? "Checking…" : "Re-check now"}
						</button>
					</div>
				</div>

				<div className={`adm-token__badge adm-token__badge--${tokenStatus.state}`}>
					<span className="adm-token__badge-state">
						{BADGE_LABEL[tokenStatus.state] ?? tokenStatus.state}
					</span>
					<span className="adm-token__badge-line">{expiryLine}</span>
				</div>

				{expiryFull && (
					<p className="adm-token__expiry-full">
						Expires on <strong>{expiryFull}</strong>
					</p>
				)}

				{/* Lifetime bar */}
				<div
					className="adm-token__bar-track"
					role="meter"
					aria-label={expiryLine}
					aria-valuenow={Math.round(barWidth)}
					aria-valuemin={0}
					aria-valuemax={100}
				>
					<div
						className={`adm-token__bar-fill adm-token__bar-fill--${tokenStatus.state}`}
						style={{ width: `${barWidth}%` }}
					/>
				</div>

				{/* Check list */}
				<ul className="adm-token__checks" aria-label="Permission checks">
					{CHECK_DEFS.map(({ key, label, fail }) => {
						const passed = tokenStatus.checks[key];
						return (
							<li key={key} className={`adm-token__check adm-token__check--${passed ? "pass" : "fail"}`}>
								<span className="adm-token__check-icon" aria-label={passed ? "Pass" : "Fail"}>
									{passed ? "✓" : "✗"}
								</span>
								<div className="adm-token__check-body">
									<span className="adm-token__check-label">{label}</span>
									{!passed && <span className="adm-token__check-fail">{fail}</span>}
								</div>
							</li>
						);
					})}
				</ul>

				{/* Rate limit */}
				{tokenStatus.rateLimit && (
					<p className="adm-token__rate">
						<strong>{tokenStatus.rateLimit.remaining.toLocaleString()}</strong>
						{" / "}{tokenStatus.rateLimit.limit.toLocaleString()} API calls remaining —
						resets {new Date(tokenStatus.rateLimit.resetAt).toLocaleTimeString()}
					</p>
				)}
			</section>

			{/* ── Renewal guide ────────────────────────────────────── */}
			<section className={`adm-token__guide${isHighlighted ? " adm-token__guide--highlighted" : ""}`}>
				<h2 className="adm-section__title">Renewal Guide</h2>
				<p className="adm-help">Follow these steps to generate a fresh token and deploy it.</p>
				<ol className="adm-token__steps">
					<li>
						<span className="adm-step__num">1</span>
						<div className="adm-step__body">
							Open{" "}
							<a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener noreferrer">
								github.com/settings/personal-access-tokens/new ↗
							</a>
						</div>
					</li>
					<li>
						<span className="adm-step__num">2</span>
						<div className="adm-step__body">
							Token name:&nbsp;
							<code className="adm-inline-code">{tokenName}</code>
							<CopyButton value={tokenName} label="token name" />
						</div>
					</li>
					<li>
						<span className="adm-step__num">3</span>
						<div className="adm-step__body">
							Expiration: <strong>1 year</strong> — add the renewal date to your calendar
						</div>
					</li>
					<li>
						<span className="adm-step__num">4</span>
						<div className="adm-step__body">
							Repository access: <em>Only selected repositories</em> →&nbsp;
							<code className="adm-inline-code">{tokenStatus.repo ?? "finnxiii/developer-portfolio"}</code>
							{tokenStatus.repo && <CopyButton value={tokenStatus.repo} label="repository name" />}
						</div>
					</li>
					<li>
						<span className="adm-step__num">5</span>
						<div className="adm-step__body">
							Permissions: <strong>Contents → Read and write</strong>; <strong>Actions → Read-only</strong>
							<br />
							<span className="adm-note">Metadata: Read-only is added automatically.</span>
						</div>
					</li>
					<li>
						<span className="adm-step__num">6</span>
						<div className="adm-step__body">Generate the token and copy it</div>
					</li>
					<li>
						<span className="adm-step__num">7</span>
						<div className="adm-step__body">
							<a href="https://dash.cloudflare.com/" target="_blank" rel="noopener noreferrer">
								dash.cloudflare.com ↗
							</a>
							{" → "}Workers &amp; Pages → <strong>{repoShortName}</strong> →
							Settings → Variables and Secrets → Production → edit{" "}
							<code className="adm-inline-code">GITHUB_TOKEN</code>
							<CopyButton value="GITHUB_TOKEN" label="variable name GITHUB_TOKEN" />
							{" "}(type Secret) → paste → Save
						</div>
					</li>
					<li>
						<span className="adm-step__num">8</span>
						<div className="adm-step__body">
							Redeploy: push any commit, or Deployments → latest → Retry
						</div>
					</li>
					<li>
						<span className="adm-step__num">9</span>
						<div className="adm-step__body">
							Return here and press <strong>Re-check now</strong> — it should show OK with the new expiry
						</div>
					</li>
					<li>
						<span className="adm-step__num">10</span>
						<div className="adm-step__body">
							Delete the old token: GitHub → Settings → Developer settings →
							Fine-grained personal access tokens
						</div>
					</li>
				</ol>
			</section>
		</main>
	);
}

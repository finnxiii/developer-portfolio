import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDraftCtx } from "./useDraftCtx";
import { useQuack } from "../../components/quack/QuackContext";
import { computeAllStagedDiff } from "./draft/diff";

const SECTIONS = [
	{ key: "profile",      name: "Profile",      path: "profile · hero, bio, links",   count: () => "1 object" },
	{ key: "projects",     name: "Projects",      path: "projects[] · case studies",    count: (d) => `${d?.projects?.length ?? 0} items` },
	{ key: "experience",   name: "Experience",    path: "experience[]",                 count: (d) => `${d?.experience?.length ?? 0} items` },
	{ key: "philosophy",   name: "Principles",    path: "philosophy[]",                 count: (d) => `${d?.philosophy?.length ?? 0} items` },
	{ key: "fieldNotes",   name: "Field notes",   path: "fieldNotes[] · markdown",      count: (d) => `${d?.fieldNotes?.length ?? 0} items` },
	{ key: "currentFocus", name: "Now",           path: "currentFocus · snapshot",      count: () => "1 object" },
	{ key: "timeline",     name: "Timeline",      path: "timeline[]",                   count: (d) => `${d?.timeline?.length ?? 0} items` },
];

function parseWeeksOld(dateStr) {
	if (!dateStr) return 0;
	const d = /^\d{4}-\d{2}/.test(dateStr)
		? new Date(dateStr.length === 7 ? dateStr + "-01" : dateStr)
		: new Date(dateStr);
	if (isNaN(d.getTime())) return 0;
	return Math.floor((Date.now() - d.getTime()) / (7 * 24 * 60 * 60 * 1000));
}

export default function AdminOverview() {
	const { base, draft, staged, stagedCount, isSectionDirty } = useDraftCtx();
	const { setQuips } = useQuack();
	const [deployStatus, setDeployStatus] = useState(null);
	const [tokenStatus, setTokenStatus] = useState(null);

	useEffect(() => {
		fetch("/api/admin/deploy-status")
			.then((r) => r.ok ? r.json() : null)
			.then((d) => d && setDeployStatus(d))
			.catch(() => {});
		fetch("/api/admin/token-status")
			.then((r) => r.ok ? r.json() : null)
			.then((d) => d && setTokenStatus(d))
			.catch(() => {});
	}, []);

	useEffect(() => {
		if (!draft?.currentFocus) return;
		const weeks = parseWeeksOld(draft.currentFocus.date);
		const quips = [
			...(weeks > 6 ? ["Your Now page is getting old. Just saying."] : []),
			"Nothing goes live until you publish.",
			"I guard the admin. Fiercely.",
		];
		setQuips(quips);
	}, [draft, setQuips]);

	const stagedChanges = computeAllStagedDiff(base, draft, staged);

	const tokenDays = tokenStatus?.daysLeft ?? null;
	const tokenPct = tokenDays === null
		? 100
		: Math.min(100, Math.max(0, Math.round((tokenDays / 365) * 100)));
	const tokenState = tokenStatus?.state ?? "ok";
	const tokenExpiry = tokenStatus?.expiresAt
		? new Date(tokenStatus.expiresAt).toLocaleDateString("en-GB", {
			day: "numeric", month: "long", year: "numeric",
		})
		: "—";

	const deployLive = deployStatus?.status === "completed" && deployStatus?.conclusion === "success";
	const deployPending = deployStatus && deployStatus.status !== "completed";
	const deployFail = deployStatus?.status === "completed" && deployStatus?.conclusion !== "success";

	return (
		<div className="adm-wrap">
			<div className="adm-ov-head">
				<div>
					<span className="adm-ov-head__label">overview</span>
					<h1 className="adm-ov-head__h1">Hi Finn.</h1>
				</div>
				<span className="adm-ov-head__live">
					finnxiii.dev <span className="adm-live-dot" aria-hidden="true" /> live
				</span>
			</div>

			{/* Status cards row */}
			<div className="adm-cards">

				{/* Git status */}
				<div className="adm-card adm-card--git">
					<span className="adm-card__label">git status</span>
					<span className="adm-card__big">
						{stagedCount}
						<span className="adm-card__big-unit"> staged</span>
					</span>
					{stagedChanges.length > 0 ? (
						<div className="adm-card__changes">
							{stagedChanges.slice(0, 5).map((c, i) => (
								<div key={i} className="adm-card__change-row">
									<span className="adm-card__m">M</span>
									<span className="adm-card__change-path">{c.path}</span>
								</div>
							))}
							{stagedChanges.length > 5 && (
								<span className="adm-card__more">+{stagedChanges.length - 5} more</span>
							)}
						</div>
					) : (
						<div className="adm-card__changes adm-card__changes--empty">
							No staged changes.
						</div>
					)}
					<Link to="/admin/publish" className="adm-card__cta">
						Review &amp; publish →
					</Link>
				</div>

				{/* Deploy */}
				<div className="adm-card">
					<span className="adm-card__label">last deploy</span>
					<span className={"adm-card__big adm-card__big--med" + (deployLive ? " adm-card__big--pass" : deployFail ? " adm-card__big--fail" : "")}>
						{deployLive && "✓ Live"}
						{deployPending && "Deploying…"}
						{deployFail && "✗ Failed"}
						{!deployStatus && "—"}
					</span>
					{deployStatus && (
						<div className="adm-card__meta">
							<div>GitHub Actions · {deployStatus.conclusion ?? deployStatus.status}</div>
						</div>
					)}
					{deployStatus?.url && (
						<a href={deployStatus.url} target="_blank" rel="noopener noreferrer" className="adm-card__link">
							view history →
						</a>
					)}
					{!deployStatus && (
						<span className="adm-card__meta">Checking…</span>
					)}
				</div>

				{/* Token */}
				<div className="adm-card">
					<span className="adm-card__label">token.env · GITHUB_TOKEN</span>
					<span className="adm-card__big adm-card__big--med">
						{tokenDays !== null ? `${tokenDays} days left` : "Never expires"}
					</span>
					<div className="adm-card__bar-track" role="meter" aria-label="Token lifetime remaining">
						<div
							className={`adm-card__bar-fill adm-card__bar-fill--${tokenState}`}
							style={{ width: `${tokenPct}%` }}
						/>
					</div>
					<span className="adm-card__meta">expires {tokenExpiry}</span>
					<Link to="/admin/token" className="adm-card__link">renewal guide →</Link>
				</div>

				{/* CV */}
				<div className="adm-card adm-card--cv">
					<div className="adm-cv-paper" aria-hidden="true">
						{Array.from({ length: 14 }, (_, i) => (
							<i key={i} className={
								"adm-cv-paper__line" +
								(i === 0 ? " adm-cv-paper__line--title" : "") +
								(i === 2 ? " adm-cv-paper__line--rule" : "")
							} />
						))}
					</div>
					<div className="adm-card__cv-info">
						<span className="adm-card__label">cv.pdf</span>
						<span className="adm-card__cv-name">NaingHtooLwin-CV.pdf</span>
						<Link to="/admin/cv" className="adm-card__link">open →</Link>
					</div>
				</div>
			</div>

			{/* Content list */}
			<div className="adm-card adm-clist">
				<div className="adm-clist__head">
					<h2 className="adm-clist__h2">content/</h2>
					<span className="adm-clist__path">src/content/fallback.json</span>
				</div>
				{SECTIONS.map((sec) => {
					const dirty = isSectionDirty(sec.key);
					const isStaged = staged.has(sec.key);
					let state = "ok";
					let stateText = "";
					if (sec.key === "currentFocus" && draft?.currentFocus?.date) {
						const weeks = parseWeeksOld(draft.currentFocus.date);
						if (weeks > 6) { state = "warn"; stateText = `${weeks}w old`; }
					}
					if (!stateText) {
						if (isStaged)   { state = "staged"; stateText = "M staged"; }
						else if (dirty) { state = "dirty";  stateText = "M edited"; }
					}

					return (
						<Link key={sec.key} to={`/admin/content/${sec.key}`} className="adm-clist__row">
							<span className="adm-clist__dot" aria-hidden="true" />
							<div className="adm-clist__info">
								<span className="adm-clist__name">{sec.name}</span>
								<span className="adm-clist__path-inline">{sec.path}</span>
							</div>
							{stateText && (
								<span className={`adm-clist__state adm-clist__state--${state}`}>
									{stateText}
								</span>
							)}
							<span className="adm-clist__count">
								{sec.count(draft)} →
							</span>
						</Link>
					);
				})}
			</div>
		</div>
	);
}

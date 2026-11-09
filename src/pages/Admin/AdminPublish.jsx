import { Link } from "react-router-dom";
import { useDraftCtx } from "./useDraftCtx";
import { computeAllStagedDiff } from "./draft/diff";

export default function AdminPublish() {
	const { base, draft, staged, stagedCount } = useDraftCtx();
	const changes = computeAllStagedDiff(base, draft, staged);

	return (
		<main className="adm-wrap">
			<span className="adm-ov-head__label">publish</span>
			<h1 className="adm-ov-head__h1">Review &amp; publish</h1>

			<div className="adm-card adm-card--publish">
				{stagedCount === 0 ? (
					<p className="ae-hint ae-hint--block">
						No sections staged. <Link to="/admin/content/profile">Go edit something →</Link>
					</p>
				) : (
					<>
						<p className="ae-hint ae-hint--block">
							<strong>{stagedCount} section{stagedCount !== 1 ? "s" : ""}</strong> staged
							with <strong>{changes.length}</strong> field change{changes.length !== 1 ? "s" : ""}.
							Single-commit publish is coming in the next phase.
						</p>
						<div className="ae-changes__list">
							{changes.map((c, i) => (
								<div key={i} className="ae-chg">
									<span className="ae-chg__path">{c.path}</span>
									{c.before !== null && <span className="ae-chg__before">{c.before}</span>}
									{c.after !== null && <span className="ae-chg__after">{c.after}</span>}
								</div>
							))}
						</div>
						<p className="ae-hint ae-hint--block adm-publish-note">
							The publish endpoint will be wired up in the next session.
							For now, use the existing admin dashboard or push manually.
						</p>
					</>
				)}
			</div>
		</main>
	);
}

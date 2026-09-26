import { Link } from "react-router-dom";
import { ProjectFigure, FIGURES } from "../../figures/index";
import "./WorkStories.scss";

function MetaRow({ num, category, status }) {
	return (
		<p className="work-stories__meta">
			<span className="work-stories__num">{num}</span>
			{category && (
				<>
					<span className="work-stories__sep" aria-hidden="true">·</span>
					<span className="work-stories__cat">{category}</span>
				</>
			)}
			{status && (
				<>
					<span className="work-stories__sep" aria-hidden="true">·</span>
					<span className="work-stories__status">{status}</span>
				</>
			)}
		</p>
	);
}

export default function WorkStories({ projects = [] }) {
	const [lead, ...rest] = projects;

	// Pair up supporting projects into 2-column rows
	const rows = [];
	for (let i = 0; i < rest.length; i += 2) {
		rows.push(rest.slice(i, i + 2));
	}

	return (
		<div className="work-stories">

			{/* ── A. Lead story ──────────────────────────────────────── */}
			{lead && (
				<div className="work-stories__lead">
					<div className="work-stories__lead-fig">
						<ProjectFigure slug={lead.slug} caption={lead.figureCaption} />
					</div>

					<div className="work-stories__lead-text">
						<MetaRow num="No. 01" category={lead.category} status={lead.status} />

						<h3 className="work-stories__lead-title">{lead.title}</h3>

						{lead.deck && (
							<p className="work-stories__lead-deck">{lead.deck}</p>
						)}

						{lead.pullQuote && (
							<blockquote className="work-stories__pullquote">
								{lead.pullQuote}
							</blockquote>
						)}

						{lead.stack?.length > 0 && (
							<p className="work-stories__stack">{lead.stack.join(" / ")}</p>
						)}

						<Link to={`/work/${lead.slug}`} className="btn btn--solid">
							Read the case study <span className="arrow" aria-hidden="true">→</span>
						</Link>
					</div>
				</div>
			)}

			{/* ── B. Supporting rows (pairs) ─────────────────────────── */}
			{rows.map((row, rowIdx) => (
				<div key={rowIdx} className="work-stories__row">
					{row.map((p, colIdx) => {
						const numStr = `No. ${String(rowIdx * 2 + colIdx + 2).padStart(2, "0")}`;
						return (
							<div
								key={p.slug}
								className={`work-stories__col${colIdx > 0 ? " work-stories__col--right" : ""}`}
							>
								<MetaRow num={numStr} category={p.category} status={p.status} />

								<h3 className="work-stories__sup-title">{p.title}</h3>

								{p.deck && (
									<p className="work-stories__sup-deck">{p.deck}</p>
								)}

								{FIGURES[p.slug] && (
									<div className="work-stories__sup-fig">
										<ProjectFigure slug={p.slug} compact />
									</div>
								)}

								<Link to={`/work/${p.slug}`} className="btn btn--solid">
									Read case study <span className="arrow" aria-hidden="true">→</span>
								</Link>
							</div>
						);
					})}
				</div>
			))}

		</div>
	);
}

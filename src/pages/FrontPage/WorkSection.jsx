import { useState } from "react";
import { Link } from "react-router-dom";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useReducedMotion } from "../../hooks/useReducedMotion";

function statusLabel(status) {
	if (status === "Completed") return "passed";
	if (status === "Prototype") return "prototype";
	return "running";
}

function PreviewContent({ preview }) {
	if (!preview) return null;
	const { kind, items = [], highlight } = preview;

	if (kind === "pipeline") {
		return (
			<div className="cs-prev-flowchips">
				{items.map((item) => (
					<span key={item} className={"cs-prev-chip" + (item === highlight ? " cs-prev-chip--on" : "")}>
						{item}
					</span>
				))}
			</div>
		);
	}
	if (kind === "diff") {
		return (
			<div className="cs-prev-diff">
				<div className="cs-prev-diff__cmd">$ import grades.csv --dry-run</div>
				<div className="cs-prev-diff__del">- grade.rate    (current)</div>
				<div className="cs-prev-diff__add">+ grade.rate    (from CSV)</div>
				<div className="cs-prev-diff__hint">? review the diff, then confirm to write</div>
			</div>
		);
	}
	if (kind === "loop") {
		return (
			<div className="cs-prev-loop">
				{items.map((item, i) => (
					<span key={item}>
						<span className={"cs-prev-chip" + (item === highlight ? " cs-prev-chip--on" : "")}>{item}</span>
						{i < items.length - 1 && <span className="cs-prev-loop__sep" aria-hidden="true">→</span>}
					</span>
				))}
				<span className="cs-prev-loop__sep" aria-hidden="true">↺</span>
			</div>
		);
	}
	return null;
}

export default function WorkSection() {
	const { data } = usePortfolioData();
	const reduced = useReducedMotion();
	const featured = (data.projects ?? []).filter((p) => p.featured);
	const [activeIdx, setActiveIdx] = useState(0);
	const [pvKey, setPvKey] = useState(0);

	function handleHover(i) {
		if (i === activeIdx) return;
		setActiveIdx(i);
		if (!reduced) setPvKey((k) => k + 1);
	}

	const active = featured[activeIdx];
	const fileName = active ? active.title.split(/\s*[-–]\s*/)[0].trim().replace(/\s+/g, "") + ".java" : "";
	const statusStr = active ? statusLabel(active.status) : "";

	return (
		<div className="work-section">
			<div className="work-section__header">
				<h2 className="fp-h2">Case studies</h2>
				<span className="fp-label work-section__hover-hint" aria-hidden="true">
					{featured.length} suites · hover a file to preview it
				</span>
			</div>
			<div className="cs-grid">
				<div className="cs-list">
					{featured.map((p, i) => {
						const num = String(i + 1).padStart(2, "0");
						const sl = statusLabel(p.status);
						return (
							<Link
								key={p.slug}
								to={`/work/${p.slug}`}
								className={"cs-row" + (i === activeIdx ? " cs-row--on" : "")}
								onMouseEnter={() => handleHover(i)}
								onFocus={() => handleHover(i)}
							>
								<span className="cs-row__num fp-label">{num}</span>
								<span className="cs-row__mid">
									<span className="cs-row__cat fp-label">{p.category}</span>
									<span className="cs-row__title">{p.title.split(/\s*[-–]\s*/)[0].trim()}</span>
									<span className="cs-row__deck">{p.deck}</span>
								</span>
								<span className={"cs-badge cs-badge--" + sl}>{sl}</span>
								<span className="cs-row__arrow" aria-hidden="true">→</span>
							</Link>
						);
					})}
				</div>

				<div className="cs-prev" aria-hidden="true">
					{active && (
						<div key={pvKey} className="cs-prev-win">
							<div className="term-bar term-bar--light">
								<span className="term-bar__dot term-bar__dot--muted" />
								<span className="term-bar__dot term-bar__dot--muted" />
								<span className="term-bar__dot term-bar__dot--muted" />
								<span className="cs-prev-win__file">projects/{fileName}</span>
								<span className="cs-prev-win__status">{statusStr}</span>
							</div>
							<div className="cs-prev-body">
								<span className="cs-prev-cat fp-label">{active.category}</span>
								<span className="cs-prev-title">{active.title.split(/\s*[-–]\s*/)[0].trim()}</span>
								<PreviewContent preview={active.preview} />
								{active.preview?.nums && (
									<div className="cs-prev-nums">
										{active.preview.nums.map((n, i) => (
											<div key={i} className="cs-prev-num">
												<span className="cs-prev-num__v">{n.v}</span>
												<span className="cs-prev-num__l">{n.l}</span>
											</div>
										))}
									</div>
								)}
								<span className="cs-prev-cta fp-label">read the case study →</span>
							</div>
						</div>
					)}
				</div>
			</div>

			<span className="cs-bignum" aria-hidden="true">
				{String(activeIdx + 1).padStart(2, "0")}
			</span>
		</div>
	);
}

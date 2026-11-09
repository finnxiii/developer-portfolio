import { Link } from "react-router-dom";
import { usePortfolioData } from "../../hooks/usePortfolioData";

export default function WorkSection() {
	const { data } = usePortfolioData();
	const featured = (data.projects ?? []).filter(p => p.featured);

	return (
		<div className="work-section">
			<div className="work-section__header">
				<h2 className="fp-h2">Selected work</h2>
				<span className="fp-label work-section__hover-hint" aria-hidden="true">hover to set a breakpoint</span>
			</div>
			{featured.map((p, i) => (
				<Link key={p.slug} to={`/work/${p.slug}`} className="work-row">
					<span className="work-row__bp" aria-hidden="true" />
					<span className="work-row__num fp-label">{String(i + 1).padStart(2, "0")}</span>
					<span className="work-row__content">
						<span className="work-row__title">{p.title.split(/\s*[-–]\s*/)[0].trim()}</span>
						<span className="work-row__deck">{p.deck}</span>
						<span className="work-row__tags">
							{p.stack.slice(0, 4).map(tag => (
								<span key={tag} className="work-row__tag">{tag}</span>
							))}
						</span>
					</span>
					<span className="work-row__arrow" aria-hidden="true">→</span>
				</Link>
			))}
		</div>
	);
}

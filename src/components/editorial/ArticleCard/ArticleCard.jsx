import { Link } from "react-router-dom";
import CategoryTag from "../../ui/CategoryTag/CategoryTag";
import TechTag from "../../ui/TechTag/TechTag";
import "./ArticleCard.scss";

export default function ArticleCard({ project, lead = false, headingAs: H = "h3" }) {
	const { slug, category, title, deck, stack = [], status, timeframe } = project;

	return (
		<article className={`article-card${lead ? " article-card--lead" : ""}`}>
			<div className="article-card__meta">
				{category && <CategoryTag label={category} />}
				{(status || timeframe) && (
					<span className="article-card__status">{status || timeframe}</span>
				)}
			</div>
			<H className="article-card__headline">
				<Link to={`/work/${slug}`} className="article-card__headline-link">
					{title}
				</Link>
			</H>
			{deck && <p className="article-card__deck">{deck}</p>}
			{stack.length > 0 && (
				<div className="article-card__tags" aria-label="Technology stack">
					{stack.slice(0, 4).map((t) => (
						<TechTag key={t} label={t} />
					))}
				</div>
			)}
			<div className="article-card__footer">
				<Link to={`/work/${slug}`} className="article-card__link">
					Read case study →
				</Link>
			</div>
		</article>
	);
}

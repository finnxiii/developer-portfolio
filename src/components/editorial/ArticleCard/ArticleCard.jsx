import { Link } from "react-router-dom";
import CategoryTag from "../../ui/CategoryTag/CategoryTag";
import TechTag from "../../ui/TechTag/TechTag";
import { ProjectFigure } from "../../figures/index";
import "./ArticleCard.scss";

export default function ArticleCard({ project, lead = false, headingAs = "h3" }) {
	const Heading = headingAs;
	const { slug, category, title, deck, stack = [], status, timeframe } = project;

	return (
		<article className={`article-card${lead ? " article-card--lead" : ""}`}>
			{lead && (
				<div className="article-card__figure-wrap">
					<ProjectFigure slug={slug} compact />
				</div>
			)}
			<div className="article-card__content">
				<div className="article-card__meta">
					{category && <CategoryTag label={category} />}
					{(status || timeframe) && (
						<span className="article-card__status">{status || timeframe}</span>
					)}
				</div>
				<Heading className="article-card__headline">{title}</Heading>
				{deck && <p className="article-card__deck">{deck}</p>}
				{stack.length > 0 && (
					<div className="article-card__tags" aria-label="Technology stack">
						{stack.slice(0, 4).map((t) => (
							<TechTag key={t} label={t} />
						))}
					</div>
				)}
				<div className="article-card__footer">
					<Link to={`/work/${slug}`} className="btn btn--solid">
						Read case study <span className="arrow" aria-hidden="true">→</span>
					</Link>
				</div>
			</div>
		</article>
	);
}

import { useRef } from "react";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import ArticleCard from "../../components/editorial/ArticleCard/ArticleCard";
import Rule from "../../components/ui/Rule/Rule";
import SEOHead from "../../components/ui/SEOHead/SEOHead";
import "./SelectedWork.scss";

export default function SelectedWork() {
	const containerRef = useRef(null);
	useScrollReveal(containerRef);

	const { data } = usePortfolioData();
	const { projects = [] } = data;
	const leadProject = projects.find((p) => p.leadProject) ?? projects[0];
	const rest = projects.filter((p) => p !== leadProject);

	return (
		<div className="selected-work" ref={containerRef}>
			<SEOHead
				title="Selected Work"
				description="Engineering projects and case studies — problem, decisions, and outcome documented in plain language."
			/>
			<div className="container">
				<header className="selected-work__header rv">
					<span className="selected-work__eyebrow label-text">Selected Work</span>
					<h1 className="selected-work__title">
						Projects worth explaining.
					</h1>
					<p className="selected-work__deck">
						Each entry is a case study, not a card. Problem, decisions, and outcome — in plain language.
					</p>
				</header>

				<Rule />

				{leadProject && (
					<div className="rv" data-reveal-delay="0.05">
						<ArticleCard project={leadProject} lead headingAs="h2" />
					</div>
				)}

				{rest.length > 0 && (
					<div className="selected-work__grid">
						{rest.map((p, i) => (
							<div key={p.slug} className="rv" data-reveal-delay={0.08 + i * 0.07}>
								<ArticleCard project={p} headingAs="h2" />
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

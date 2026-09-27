import { useRef } from "react";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import PageHeader from "../../components/editorial/PageHeader/PageHeader";
import SEOHead from "../../components/ui/SEOHead/SEOHead";
import WorkStories from "../../components/editorial/WorkStories/WorkStories";
import "./SelectedWork.scss";

export default function SelectedWork() {
	const containerRef = useRef(null);
	useScrollReveal(containerRef);

	const { data } = usePortfolioData();
	const { projects = [] } = data;
	const leadProject = projects.find((p) => p.leadProject) ?? projects[0];
	const rest = projects.filter((p) => p !== leadProject);
	const orderedProjects = leadProject ? [leadProject, ...rest] : projects;

	return (
		<div className="selected-work" ref={containerRef}>
			<SEOHead
				title="Selected Work"
				description="Engineering projects and case studies — problem, decisions, and outcome documented in plain language."
			/>
			<div className="container">
				<PageHeader
					kicker="§2 · Selected Work"
					title="Projects worth explaining."
					deck="Each entry is a case study, not a card. Problem, decisions, and outcome — in plain language."
					meta={`${projects.length} projects`}
				/>

				<div className="rv" data-reveal-delay="0.05">
					<WorkStories projects={orderedProjects} />
				</div>
			</div>
		</div>
	);
}

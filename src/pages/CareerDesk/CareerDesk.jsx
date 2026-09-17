import { useRef } from "react";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import TimelineEntry from "../../components/editorial/TimelineEntry/TimelineEntry";
import Rule from "../../components/ui/Rule/Rule";
import SEOHead from "../../components/ui/SEOHead/SEOHead";
import "./CareerDesk.scss";

export default function CareerDesk() {
	const containerRef = useRef(null);
	useScrollReveal(containerRef);

	const { data } = usePortfolioData();
	const { profile, experience = [] } = data;
	const cv = profile?.links?.cv;

	return (
		<div className="career-desk" ref={containerRef}>
			<SEOHead
				title="Career Desk"
				description="Education, roles, and engineering responsibilities — a readable timeline with a direct CV download."
			/>
			<div className="container">

				<header className="career-desk__header rv">
					<span className="career-desk__eyebrow label-text">Career Desk</span>
					<h1 className="career-desk__title">Where the work comes from.</h1>
					<p className="career-desk__deck">
						Education, roles, and responsibilities — in reverse-chronological order.
						A readable layer on top of the CV.
					</p>
				</header>

				{cv && (
					<div className="career-desk__cta rv" data-reveal-delay="0.05">
						<a
							href={cv}
							className="career-desk__cv-link"
							download
						>
							Download CV (PDF) ↓
						</a>
					</div>
				)}

				<Rule />

				<div className="career-desk__timeline">
					{experience.map((entry, i) => (
						<div key={i} className="rv" data-reveal-delay={i * 0.08}>
							<TimelineEntry {...entry} />
						</div>
					))}
				</div>

				{cv && (
					<>
						<Rule />
						<div className="career-desk__footer-cta rv">
							<p className="career-desk__footer-note">
								The CV contains the full picture, including grades, links, and details not listed here.
							</p>
							<a href={cv} className="career-desk__cv-link" download>
								Download CV (PDF) ↓
							</a>
						</div>
					</>
				)}

			</div>
		</div>
	);
}

import { useRef } from "react";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import PhilosophyItem from "../../components/editorial/PhilosophyItem/PhilosophyItem";
import Rule from "../../components/ui/Rule/Rule";
import SEOHead from "../../components/ui/SEOHead/SEOHead";
import "./Philosophy.scss";

export default function Philosophy() {
	const containerRef = useRef(null);
	useScrollReveal(containerRef);

	const { data } = usePortfolioData();
	const { philosophy = [] } = data;

	return (
		<div className="philosophy-page" ref={containerRef}>
			<SEOHead
				title="Engineering Philosophy"
				description="Operating principles grounded in real decisions — how the work gets made, trade-offs get communicated, and problems get investigated."
			/>
			<div className="container">
				<header className="philosophy-page__header rv">
					<span className="philosophy-page__eyebrow label-text">Engineering Philosophy</span>
					<h1 className="philosophy-page__title">How the work gets made.</h1>
					<p className="philosophy-page__deck">
						Operating principles — not generic values. Each is grounded in real decisions,
						real constraints, and real projects.
					</p>
				</header>

				<Rule />

				<div className="philosophy-page__body">
					{philosophy.map((item, i) => (
						<div key={i} className="rv" data-reveal-delay={i * 0.08}>
							<PhilosophyItem {...item} showExample />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

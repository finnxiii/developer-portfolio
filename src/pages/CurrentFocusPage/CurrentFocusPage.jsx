import { useRef } from "react";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import Rule from "../../components/ui/Rule/Rule";
import SEOHead from "../../components/ui/SEOHead/SEOHead";
import "./CurrentFocusPage.scss";

export default function CurrentFocusPage() {
	const containerRef = useRef(null);
	useScrollReveal(containerRef);

	const { data } = usePortfolioData();
	const { currentFocus } = data;
	const { date, building, learning, exploring } = currentFocus;

	return (
		<div className="current-focus-page" ref={containerRef}>
			<SEOHead
				title="Now"
				description={`A dated snapshot of what is on the desk right now — ${currentFocus.date}. Building, learning, and exploring.`}
			/>
			<div className="container">
				<header className="current-focus-page__header rv">
					<span className="current-focus-page__eyebrow label-text">Current Focus</span>
					<h1 className="current-focus-page__title">
						A dated snapshot of what is on the desk right now.
					</h1>
					{date && (
						<p className="current-focus-page__date">{date}</p>
					)}
				</header>

				<Rule />

				<div className="current-focus-page__body">
					{building && (
						<section className="current-focus-page__item rv" data-reveal-delay="0.05">
							<h2 className="current-focus-page__item-label label-text">Building</h2>
							<p className="current-focus-page__item-text">{building}</p>
						</section>
					)}
					{learning && (
						<section className="current-focus-page__item rv" data-reveal-delay="0.1">
							<h2 className="current-focus-page__item-label label-text">Learning</h2>
							<p className="current-focus-page__item-text">{learning}</p>
						</section>
					)}
					{exploring && (
						<section className="current-focus-page__item rv" data-reveal-delay="0.15">
							<h2 className="current-focus-page__item-label label-text">Exploring</h2>
							<p className="current-focus-page__item-text">{exploring}</p>
						</section>
					)}
				</div>

				<div className="current-focus-page__note rv" data-reveal-delay="0.2">
					<p>
						This panel is updated when something material changes. An old date means the focus
						has not shifted, not that the site is abandoned.
					</p>
				</div>

			</div>
		</div>
	);
}

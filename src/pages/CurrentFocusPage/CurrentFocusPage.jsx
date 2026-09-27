import { useRef } from "react";
import { Link } from "react-router-dom";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import PageHeader from "../../components/editorial/PageHeader/PageHeader";
import SEOHead from "../../components/ui/SEOHead/SEOHead";
import "./CurrentFocusPage.scss";

const SECTIONS = [
	{ key: "building", label: "Building", roman: "I" },
	{ key: "learning", label: "Learning", roman: "II" },
	{ key: "exploring", label: "Exploring", roman: "III" },
];

export default function CurrentFocusPage() {
	const containerRef = useRef(null);
	useScrollReveal(containerRef);

	const { data } = usePortfolioData();
	const { currentFocus } = data;
	const {
		date,
		building,
		learning,
		exploring,
		buildingLink,
	} = currentFocus;

	const sectionValues = { building, learning, exploring };

	return (
		<div className="now-page" ref={containerRef}>
			<SEOHead
				title="Now"
				description={`A dated snapshot of what is on my desk right now — ${date}. Building, learning, and exploring.`}
			/>
			<div className="container">
				<PageHeader
					kicker="§5 · Now"
					title="Now."
					deck="A dated snapshot of what's on my desk."
					meta={`Updated ${date}`}
				/>

				{/* ── Body grid: status · article · sidenote ───────────────── */}
				<div className="now-body-grid rv" data-reveal-delay="0.1">
					{/* Left: sticky status panel */}
					<div className="now-status">
						<div className="now-status__row">
							<span className="now-status__dot" aria-hidden="true" />
							<span className="now-status__active label-text">Active</span>
						</div>
						<p className="now-status__date">{date}</p>
					</div>

					{/* Centre: three Roman-numeral sections */}
					<article className="now-article">
						{SECTIONS.map(({ key, label, roman }) => {
							const text = sectionValues[key];
							if (!text) return null;
							return (
								<section key={key} className="now-section">
									<div className="now-section__head">
										<span className="now-section__roman" aria-hidden="true">{roman}.</span>
										<h2 className="now-section__title">{label}</h2>
									</div>
									<p className="now-section__body">{text}</p>
									{key === "building" && buildingLink && (
										<Link to={buildingLink} className="btn btn--solid now-section__cta">
											Read the Vigil case study →
										</Link>
									)}
								</section>
							);
						})}
					</article>

					{/* Right: "What is a now page?" sidenote */}
					<aside className="now-sidenotes">
						<div className="now-sidenote">
							<p className="now-sidenote__label label-text">What is a now page?</p>
							<p className="now-sidenote__text">
								A snapshot of current focus, updated when things change. Inspired by{" "}
								<a
									href="https://nownownow.com"
									className="now-sidenote__link"
									target="_blank"
									rel="noopener noreferrer"
								>
									nownownow.com
								</a>
								.
							</p>
						</div>
					</aside>
				</div>
			</div>
		</div>
	);
}

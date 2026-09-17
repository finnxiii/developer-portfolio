import { useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import Breadcrumb from "../../components/ui/Breadcrumb/Breadcrumb";
import SEOHead from "../../components/ui/SEOHead/SEOHead";
import CategoryTag from "../../components/ui/CategoryTag/CategoryTag";
import ProjectFacts from "../../components/ui/ProjectFacts/ProjectFacts";
import "./CaseStudy.scss";

function renderBody(text) {
	if (!text) return null;
	return text
		.split(/\n\n+/)
		.filter(Boolean)
		.map((para, i) => <p key={i}>{para}</p>);
}

function ArticleSection({ title, content }) {
	if (!content) return null;
	return (
		<section className="case-study__section rv">
			<h2 className="case-study__section-title">{title}</h2>
			<div className="case-study__section-body">{renderBody(content)}</div>
		</section>
	);
}

export default function CaseStudy() {
	const { slug } = useParams();
	const containerRef = useRef(null);
	useScrollReveal(containerRef);

	const { data } = usePortfolioData();
	const { projects = [] } = data;
	const idx = projects.findIndex((p) => p.slug === slug);
	const project = projects[idx];

	if (!project) {
		return (
			<div className="container case-study__not-found">
				<SEOHead title="Project not found" />
				<p>Project not found.</p>
				<Link to="/work">← Back to Selected Work</Link>
			</div>
		);
	}

	const { category, title, deck, screenshot, sections = {} } = project;
	const prev = idx > 0 ? projects[idx - 1] : null;
	const next = idx < projects.length - 1 ? projects[idx + 1] : null;

	return (
		<div className="case-study" ref={containerRef}>
			<SEOHead
				title={title}
				description={deck ? `${deck} Case study — role, decisions, and outcome.` : undefined}
			/>
			<div className="container">
				<Breadcrumb
					items={[
						{ label: "Selected Work", to: "/work" },
						{ label: title },
					]}
				/>

				<header className="case-study__header rv">
					{category && <CategoryTag label={category} />}
					<h1 className="case-study__title">{title}</h1>
					{deck && <p className="case-study__deck">{deck}</p>}
				</header>

				<div className="case-study__body">
					{/* Sidebar first in DOM → top block on mobile, right column on desktop */}
					<aside className="case-study__sidebar rv" data-reveal-delay="0.08">
						<ProjectFacts project={project} />
					</aside>

					<article className="case-study__article">
						{screenshot && (
							<div className="case-study__screenshot rv">
								<img
									src={screenshot}
									alt={`Screenshot of ${title}`}
									loading="lazy"
									width="800"
									height="500"
								/>
							</div>
						)}

						<ArticleSection title="The Problem" content={sections.problem} />
						<ArticleSection title="Investigation" content={sections.investigation} />
						<ArticleSection title="Implementation" content={sections.implementation} />
						<ArticleSection title="What Broke / Trade-offs" content={sections.whatBroke} />
						<ArticleSection title="Outcome" content={sections.outcome} />
						<ArticleSection title="What I Learned" content={sections.learned} />
					</article>
				</div>

				{(prev || next) && (
					<nav className="case-study__nav" aria-label="Project navigation">
						<div className="case-study__nav-inner">
							{prev ? (
								<Link to={`/work/${prev.slug}`} className="case-study__nav-link case-study__nav-link--prev">
									<span className="case-study__nav-label label-text">Previous</span>
									<span className="case-study__nav-title">{prev.title}</span>
								</Link>
							) : <span />}
							{next ? (
								<Link to={`/work/${next.slug}`} className="case-study__nav-link case-study__nav-link--next">
									<span className="case-study__nav-label label-text">Next</span>
									<span className="case-study__nav-title">{next.title}</span>
								</Link>
							) : <span />}
						</div>
					</nav>
				)}
			</div>
		</div>
	);
}

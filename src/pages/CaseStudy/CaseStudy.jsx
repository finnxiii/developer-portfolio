import { useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import SEOHead from "../../components/ui/SEOHead/SEOHead";
import { ProjectFigure } from "../../components/figures/index";
import "./CaseStudy.scss";

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

function countWords(text = "") {
	return text.trim().split(/\s+/).filter(Boolean).length;
}

function calcReadTime(sections = {}) {
	const total = Object.values(sections).reduce(
		(acc, v) => acc + countWords(v ?? ""),
		0
	);
	return Math.max(1, Math.ceil(total / 200));
}

function renderBody(text) {
	if (!text) return null;
	return text
		.split(/\n\n+/)
		.filter(Boolean)
		.map((para, i) => <p key={i}>{para}</p>);
}

function renderCorrectionsBody(text) {
	if (!text) return null;
	const paras = text.split(/\n\n+/).filter(Boolean);
	return paras.map((para, i) => {
		if (i === 0) {
			const spaceIdx = para.indexOf(" ");
			const firstWord = spaceIdx === -1 ? para : para.slice(0, spaceIdx);
			const rest = spaceIdx === -1 ? "" : para.slice(spaceIdx);
			return (
				<p key={i}>
					<span className="case-study__corrections-firstword">{firstWord}</span>
					{rest}
				</p>
			);
		}
		return <p key={i}>{para}</p>;
	});
}

const SECTION_ORDER = [
	{ key: "problem",        label: "The Problem" },
	{ key: "investigation",  label: "Investigation" },
	{ key: "implementation", label: "Implementation" },
	{ key: "outcome",        label: "Outcome" },
	{ key: "learned",        label: "What I Learned" },
];

export default function CaseStudy() {
	const { slug } = useParams();
	const containerRef = useRef(null);
	useScrollReveal(containerRef);

	const { data } = usePortfolioData();
	const { projects = [], fieldNotes = [] } = data;
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

	const { category, title, deck, figureCaption, sections = {}, numbers = [] } = project;
	const projectNum = String(idx + 1).padStart(2, "0");
	const readTime = calcReadTime(sections);
	const next = idx < projects.length - 1 ? projects[idx + 1] : null;
	const nextNum = next ? String(idx + 2).padStart(2, "0") : null;
	const relatedNote = project.relatedNote
		? fieldNotes.find((n) => n.slug === project.relatedNote) ?? null
		: null;

	const facts = [
		{ label: "Role",      val: project.role },
		{ label: "Team",      val: project.team },
		{ label: "Timeframe", val: project.timeframe },
		{ label: "Stack",     val: project.stack?.join(" / ") },
		{ label: "Source",    val: project.github, isLink: Boolean(project.github) },
	];

	return (
		<div className="case-study" ref={containerRef}>
			<SEOHead
				title={title}
				description={deck ? `${deck} Case study — role, decisions, and outcome.` : undefined}
			/>

			{/* ── Breadcrumb row ────────────────────────────────────────── */}
			<div className="case-study__crumb-row">
				<div className="container">
					<div className="case-study__crumb-inner">
						<nav aria-label="Breadcrumb" className="case-study__crumb-nav">
							<Link to="/work" className="case-study__crumb-link">Selected Work</Link>
							<span className="case-study__crumb-sep" aria-hidden="true">→</span>
							<span className="case-study__crumb-current" aria-current="page">{title}</span>
						</nav>
						<span className="case-study__crumb-meta">
							Case study No. {projectNum} · {readTime} min read
						</span>
					</div>
				</div>
			</div>

			{/* ── Header grid ───────────────────────────────────────────── */}
			<div className="case-study__header-wrap">
				<div className="container">
					<div className="case-study__header rv">
						<div className="case-study__header-title-col">
							<p className="case-study__kicker label-text">
								{category} · {project.status}
							</p>
							<h1 className="case-study__title">{title}</h1>
						</div>
						{deck && (
							<div className="case-study__header-deck-col">
								<p className="case-study__deck">{deck}</p>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* ── Facts strip ───────────────────────────────────────────── */}
			<div className="case-study__facts-strip">
				<div className="container">
					<div className="case-study__facts-inner">
						{facts.map((fact, i) => (
							<div key={i} className="case-study__fact">
								<span className="case-study__fact-label label-text">{fact.label}</span>
								{fact.isLink ? (
									<a
										href={fact.val}
										className="case-study__fact-val case-study__fact-val--link"
										target="_blank"
										rel="noopener noreferrer"
									>
										GitHub ↗
									</a>
								) : (
									<span className="case-study__fact-val">{fact.val || "—"}</span>
								)}
							</div>
						))}
					</div>
				</div>
			</div>

			{/* ── Full-width figure ─────────────────────────────────────── */}
			<div className="case-study__figure-wrap">
				<div className="container">
					<div className="case-study__figure-panel">
						<ProjectFigure slug={slug} caption={null} />
					</div>
					{figureCaption && (
						<p className="case-study__figure-caption">{figureCaption}</p>
					)}
				</div>
			</div>

			{/* ── Body ──────────────────────────────────────────────────── */}
			<div className="case-study__body-wrap">
				<div className="container">
					<div className="case-study__body">

						{/* Left: By the numbers */}
						<aside className="case-study__numbers rv" aria-label="By the numbers">
							<p className="case-study__numbers-heading label-text">By the numbers</p>
							{numbers.map((item, i) => (
								<div key={i} className="case-study__number-item">
									<span
										className={`case-study__number-val${
											i === 0 ? " case-study__number-val--accent" : ""
										}`}
									>
										{item.value}
									</span>
									<span className="case-study__number-label">{item.label}</span>
								</div>
							))}
						</aside>

						{/* Centre: article */}
						<article className="case-study__article">
							{SECTION_ORDER.map((s, i) => {
								if (!sections[s.key]) return null;
								const isFirst = i === 0;
								return (
									<section key={s.key} className="case-study__section rv">
										<div className="case-study__section-head">
											<span className="case-study__section-roman" aria-hidden="true">
												{ROMAN[i]}.
											</span>
											<h2 className="case-study__section-title">{s.label}</h2>
										</div>
										<div
											className={`case-study__section-body${
												isFirst ? " case-study__section-body--dropcap" : ""
											}`}
										>
											{renderBody(sections[s.key])}
										</div>
										{isFirst && project.pullQuote && (
											<blockquote className="case-study__pullquote rv">
												{project.pullQuote}
											</blockquote>
										)}
									</section>
								);
							})}

							{sections.whatBroke && (
								<aside
									className="case-study__corrections rv"
									aria-labelledby="corrections-heading"
								>
									<span className="case-study__corrections-label label-text">
										Corrections &amp; Clarifications
									</span>
									<h2 id="corrections-heading" className="case-study__corrections-title">
										What broke, and what I traded away
									</h2>
									<div className="case-study__corrections-body">
										{renderCorrectionsBody(sections.whatBroke)}
									</div>
									<footer className="case-study__corrections-footer">
										Published in the spirit of a newspaper correction: what went wrong, stated plainly.
									</footer>
								</aside>
							)}
						</article>

						{/* Right: sidenotes (visible ≥1200px) */}
						<aside className="case-study__right-col" aria-label="Sidenotes">
							{figureCaption && (
								<div className="case-study__sidenote case-study__sidenote--note">
									<span className="case-study__sidenote-label">Note</span>
									<p className="case-study__sidenote-text">{figureCaption}</p>
								</div>
							)}
							{relatedNote && (
								<div className="case-study__sidenote case-study__sidenote--related">
									<span className="case-study__sidenote-label">Related field note</span>
									<Link
										to={`/notes/${relatedNote.slug}`}
										className="case-study__sidenote-link"
									>
										{relatedNote.title}
									</Link>
								</div>
							)}
						</aside>
					</div>
				</div>
			</div>

			{/* ── Next story bar ────────────────────────────────────────── */}
			{next && (
				<div className="case-study__next-bar">
					<div className="container">
						<div className="case-study__next-inner">
							<span className="case-study__next-label label-text">
								Next story · No. {nextNum}
							</span>
							<p className="case-study__next-title">{next.title}</p>
							<Link
								to={`/work/${next.slug}`}
								className="btn btn--outline case-study__next-cta"
							>
								Read the case study <span className="arrow" aria-hidden="true">→</span>
							</Link>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

import { useRef, useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import SEOHead from "../../components/ui/SEOHead/SEOHead";
import StoryPager from "../../components/editorial/StoryPager/StoryPager";
import { parseNoteBody } from "../../utils/parseMarkdown";
import { getLenis } from "../../hooks/useSmoothScroll";
import "./FieldNote.scss";

function formatDate(iso) {
	if (!iso) return "";
	const d = new Date(iso + "T12:00:00");
	return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(d);
}

export default function FieldNote() {
	const { slug } = useParams();
	const containerRef = useRef(null);
	useScrollReveal(containerRef);

	const { data } = usePortfolioData();
	const { fieldNotes = [], projects = [] } = data;
	const idx = fieldNotes.findIndex((n) => n.slug === slug);
	const note = fieldNotes[idx] ?? null;

	// All hooks must run unconditionally — use safe defaults when note is null
	const body = note?.body ?? "";
	const relatedProjectSlug = note?.relatedProject ?? null;

	const { html, headings } = useMemo(() => parseNoteBody(body), [body]);

	const relatedProjectData = useMemo(
		() => (relatedProjectSlug ? projects.find((p) => p.slug === relatedProjectSlug) ?? null : null),
		[relatedProjectSlug, projects]
	);

	const [activeId, setActiveId] = useState(null);

	useEffect(() => {
		if (!headings.length) return;
		const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean);
		if (!els.length) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const intersecting = entries.filter((e) => e.isIntersecting);
				if (intersecting.length) setActiveId(intersecting[0].target.id);
			},
			{ rootMargin: "-10% 0% -75% 0%", threshold: 0 }
		);

		els.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	}, [headings]);

	if (!note) {
		return (
			<div className="container fn-note__not-found">
				<SEOHead title="Note not found" />
				<p>Note not found.</p>
				<Link to="/notes">← Back to Field Notes</Link>
			</div>
		);
	}

	const { title, date, topic, readTime, deck } = note;
	const noteNum = String(idx + 1).padStart(2, "0");
	const prev = idx > 0 ? fieldNotes[idx - 1] : null;
	const next = idx < fieldNotes.length - 1 ? fieldNotes[idx + 1] : null;
	const prevNum = prev ? String(idx).padStart(2, "0") : null;
	const nextNum = next ? String(idx + 2).padStart(2, "0") : null;

	function scrollToSection(id) {
		const el = document.getElementById(id);
		if (!el) return;
		const lenis = getLenis();
		if (lenis) lenis.scrollTo(el, { offset: -80 });
		else el.scrollIntoView({ behavior: "smooth", block: "start" });
	}

	return (
		<div className="fn-note" ref={containerRef}>
			<SEOHead
				title={title}
				description={deck || `${topic} field note — ${readTime} read.`}
			/>

			{/* ── Breadcrumb row ──────────────────────────────────────────── */}
			<div className="fn-note__crumb-row">
				<div className="container">
					<div className="fn-note__crumb-inner">
						<nav className="fn-note__crumb-nav" aria-label="Breadcrumb">
							<Link to="/notes" className="fn-note__crumb-link">Field Notes</Link>
							<span className="fn-note__crumb-sep" aria-hidden="true"> → </span>
							<span className="fn-note__crumb-current">{title}</span>
						</nav>
						<span className="fn-note__crumb-meta label-text">
							Field note No. {noteNum} · {readTime} read
						</span>
					</div>
				</div>
			</div>

			<div className="container">
				{/* ── Header grid ──────────────────────────────────────────── */}
				<div className="fn-note__header-wrap rv">
					<header className="fn-note__header">
						<p className="fn-note__kicker label-text">
							<span className="fn-note__kicker-topic">{topic}</span>
							{date && (
								<>
									<span aria-hidden="true"> · </span>
									<time dateTime={date}>{formatDate(date)}</time>
								</>
							)}
						</p>
						<h1 className="fn-note__title">{title}</h1>
					</header>
					{deck && <p className="fn-note__deck">{deck}</p>}
				</div>

				{/* ── Facts strip ──────────────────────────────────────────── */}
				<div className="fn-note__facts-strip rv" data-reveal-delay="0.05">
					<div className="fn-note__fact">
						<span className="fn-note__fact-label">Published</span>
						<span className="fn-note__fact-val">{formatDate(date)}</span>
					</div>
					<div className="fn-note__fact">
						<span className="fn-note__fact-label">Topic</span>
						<span className="fn-note__fact-val">{topic}</span>
					</div>
					<div className="fn-note__fact">
						<span className="fn-note__fact-label">Read time</span>
						<span className="fn-note__fact-val">{readTime}</span>
					</div>
					<div className="fn-note__fact">
						<span className="fn-note__fact-label">Related project</span>
						<span className="fn-note__fact-val">
							{relatedProjectData ? (
								<Link to={`/work/${relatedProjectData.slug}`} className="fn-note__fact-link">
									{relatedProjectData.title}
								</Link>
							) : (
								"—"
							)}
						</span>
					</div>
				</div>

				{/* ── Body grid: TOC · article · sidenotes ─────────────────── */}
				<div className="fn-note__body-grid rv" data-reveal-delay="0.1">
					{/* Left: sticky TOC */}
					<div className="fn-note__toc-col">
						{headings.length > 0 && (
							<nav className="fn-note-toc" aria-label="In this note">
								<p className="fn-note-toc__heading">In this note</p>
								<ul className="fn-note-toc__list" role="list">
									{headings.map(({ id, text }) => (
										<li key={id}>
											<button
												type="button"
												className={`fn-note-toc__link${activeId === id ? " fn-note-toc__link--active" : ""}`}
												onClick={() => scrollToSection(id)}
											>
												{text}
											</button>
										</li>
									))}
								</ul>
							</nav>
						)}
					</div>

					{/* Centre: markdown article body */}
					<article
						className="fn-note__body"
						// parseNoteBody escapes HTML before applying inline patterns
						dangerouslySetInnerHTML={{ __html: html }}
					/>

					{/* Right: sidenotes (desktop ≥1200px only) */}
					<aside className="fn-note__sidenotes">
						{relatedProjectData && (
							<div className="fn-note__sidenote">
								<p className="fn-note__sidenote-label label-text">Related case study</p>
								<Link
									to={`/work/${relatedProjectData.slug}`}
									className="fn-note__sidenote-card"
								>
									<p className="fn-note__sidenote-title">{relatedProjectData.title}</p>
									<p className="fn-note__sidenote-deck">{relatedProjectData.deck}</p>
									<span className="fn-note__sidenote-cta">Read the case study →</span>
								</Link>
							</div>
						)}
					</aside>
				</div>
			</div>

			{/* ── Prev / Next pager ─────────────────────────────────────── */}
			<StoryPager
				prev={prev ? { slug: prev.slug, title: prev.title, num: prevNum } : null}
				next={next ? { slug: next.slug, title: next.title, num: nextNum } : null}
				kind="note"
				basePath="/notes"
			/>
		</div>
	);
}

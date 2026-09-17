import { useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import Breadcrumb from "../../components/ui/Breadcrumb/Breadcrumb";
import SEOHead from "../../components/ui/SEOHead/SEOHead";
import { parseMarkdown } from "../../utils/parseMarkdown";
import "./FieldNote.scss";

export default function FieldNote() {
	const { slug } = useParams();
	const containerRef = useRef(null);
	useScrollReveal(containerRef);

	const { data } = usePortfolioData();
	const { fieldNotes = [] } = data;
	const idx = fieldNotes.findIndex((n) => n.slug === slug);
	const note = fieldNotes[idx];

	if (!note) {
		return (
			<div className="container field-note__not-found">
				<SEOHead title="Note not found" />
				<p>Note not found.</p>
				<Link to="/notes">← Back to Field Notes</Link>
			</div>
		);
	}

	const { title, date, topic, readTime, body } = note;
	const prev = idx > 0 ? fieldNotes[idx - 1] : null;
	const next = idx < fieldNotes.length - 1 ? fieldNotes[idx + 1] : null;

	return (
		<div className="field-note" ref={containerRef}>
			<SEOHead
				title={title}
				description={`${topic} field note — ${readTime} read.`}
			/>
			<div className="container">
				<Breadcrumb
					items={[
						{ label: "Field Notes", to: "/notes" },
						{ label: title },
					]}
				/>

				<header className="field-note__header rv">
					<div className="field-note__meta">
						{date && <time className="field-note__date" dateTime={date}>{date}</time>}
						{topic && <span className="field-note__topic">{topic}</span>}
						{readTime && <span className="field-note__read">{readTime} read</span>}
					</div>
					<h1 className="field-note__title">{title}</h1>
				</header>

				<article
					className="field-note__body rv"
					data-reveal-delay="0.05"
					// parseMarkdown escapes HTML before applying inline patterns
					dangerouslySetInnerHTML={{ __html: parseMarkdown(body) }}
				/>

				{(prev || next) && (
					<nav className="field-note__nav" aria-label="Note navigation">
						<div className="field-note__nav-inner">
							{prev ? (
								<Link to={`/notes/${prev.slug}`} className="field-note__nav-link field-note__nav-link--prev">
									<span className="field-note__nav-label label-text">Previous</span>
									<span className="field-note__nav-title">{prev.title}</span>
								</Link>
							) : <span />}
							{next ? (
								<Link to={`/notes/${next.slug}`} className="field-note__nav-link field-note__nav-link--next">
									<span className="field-note__nav-label label-text">Next</span>
									<span className="field-note__nav-title">{next.title}</span>
								</Link>
							) : <span />}
						</div>
					</nav>
				)}
			</div>
		</div>
	);
}

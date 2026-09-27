import { useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import PageHeader from "../../components/editorial/PageHeader/PageHeader";
import SEOHead from "../../components/ui/SEOHead/SEOHead";
import "./FieldNotes.scss";

function formatDate(iso) {
	if (!iso) return "";
	const d = new Date(iso + "T12:00:00");
	return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" })
		.format(d)
		.toUpperCase();
}

function dateline(iso) {
	if (!iso) return "";
	const d = new Date(iso + "T12:00:00");
	const day = d.getDate();
	const mon = d.toLocaleString("en-GB", { month: "short" }).toUpperCase();
	const yr = d.getFullYear();
	return `SHEFFIELD, ${day} ${mon} ${yr}`;
}

function stripMarkdown(text = "") {
	return (
		text
			.replace(/^#{1,6}\s+/gm, "")
			.replace(/\*\*(.+?)\*\*/g, "$1")
			.replace(/\*(.+?)\*/g, "$1")
			.replace(/`(.+?)`/g, "$1")
			.replace(/^-\s+/gm, "")
			.split(/\n\n+/)
			.find(Boolean) ?? ""
	);
}

export default function FieldNotes() {
	const containerRef = useRef(null);
	useScrollReveal(containerRef);
	const prefersReduced = useReducedMotion();

	const { data } = usePortfolioData();
	const { fieldNotes = [] } = data;

	const allTopics = useMemo(
		() => ["All", ...new Set(fieldNotes.map((n) => n.topic).filter(Boolean))],
		[fieldNotes]
	);

	const [activeTopic, setActiveTopic] = useState("All");

	const filtered = useMemo(
		() => (activeTopic === "All" ? fieldNotes : fieldNotes.filter((n) => n.topic === activeTopic)),
		[fieldNotes, activeTopic]
	);

	const lead = filtered[0] ?? null;
	const rest = filtered.slice(1);
	const leadNum = lead ? String(fieldNotes.indexOf(lead) + 1).padStart(2, "0") : "01";

	const listRef = useRef(null);

	useGSAP(
		() => {
			if (prefersReduced || !listRef.current) return;
			const items = gsap.utils.toArray(".fn-lead, .fn-index__item", listRef.current);
			if (!items.length) return;
			gsap.fromTo(
				items,
				{ opacity: 0, y: 12 },
				{
					opacity: 1,
					y: 0,
					duration: 0.25,
					stagger: 0.04,
					ease: "power2.out",
					clearProps: "opacity,transform",
				}
			);
		},
		{ scope: listRef, dependencies: [activeTopic] }
	);

	return (
		<div className="field-notes" ref={containerRef}>
			<SEOHead
				title="Field Notes"
				description="Technical field notes, build logs, and engineering reflections — specific, honest, and short."
			/>
			<div className="container">
				<PageHeader
					kicker="§4 · Field Notes"
					title="Working notes from the build."
					deck="Build logs, debugging postmortems, design decisions, and learning reflections. Short, honest, and specific."
					meta={fieldNotes.length > 0 ? `${fieldNotes.length} notes` : undefined}
				/>

				{/* Topic filter — only if more than 2 distinct topics */}
				{allTopics.length > 2 && (
					<div className="fn-filter rv" role="group" aria-label="Filter by topic">
						{allTopics.map((topic) => (
							<button
								key={topic}
								type="button"
								className={`fn-filter__pill${activeTopic === topic ? " fn-filter__pill--active" : ""}`}
								aria-pressed={activeTopic === topic}
								onClick={() => setActiveTopic(topic)}
							>
								{topic}
							</button>
						))}
					</div>
				)}

				<div ref={listRef}>
					{fieldNotes.length === 0 ? (
						<p className="field-notes__empty rv">No notes published yet.</p>
					) : filtered.length === 0 ? (
						<p className="field-notes__empty rv">No notes in this topic yet.</p>
					) : (
						<>
							{/* Lead note */}
							{lead && (
								<div className="fn-lead">
									<div className="fn-lead__main">
										<p className="fn-lead__num label-text">No. {leadNum}</p>
										<p className="fn-lead__meta">
											<span className="fn-lead__topic">{lead.topic}</span>
											<span className="fn-lead__sep" aria-hidden="true"> · </span>
											<time dateTime={lead.date}>{formatDate(lead.date)}</time>
											<span className="fn-lead__sep" aria-hidden="true"> · </span>
											<span>{lead.readTime} read</span>
										</p>
										<h2 className="fn-lead__title">
											<Link to={`/notes/${lead.slug}`}>{lead.title}</Link>
										</h2>
										<p className="fn-lead__excerpt drop-cap">
											{lead.deck || stripMarkdown(lead.body)}
										</p>
									</div>
									<aside className="fn-lead__aside" aria-hidden="true">
										<span className="fn-lead__num-display">{leadNum}</span>
										<Link
											to={`/notes/${lead.slug}`}
											className="btn btn--solid fn-lead__cta"
											aria-label={`Read: ${lead.title}`}
										>
											Read the note <span className="arrow">→</span>
										</Link>
									</aside>
								</div>
							)}

							{/* Remaining notes 2-col grid */}
							{rest.length > 0 && (
								<div className="fn-grid">
									{rest.map((note) => {
										const noteNum = String(fieldNotes.indexOf(note) + 1).padStart(2, "0");
										return (
											<article key={note.slug} className="fn-index__item">
												<p className="fn-index__num">
													<span className="fn-index__num-accent">No. {noteNum}</span>
													{" · "}
													<span>{note.topic}</span>
												</p>
												<p className="fn-index__dateline">
													<time dateTime={note.date}>{dateline(note.date)}</time>
												</p>
												<h2 className="fn-index__title">
													<Link to={`/notes/${note.slug}`}>{note.title}</Link>
												</h2>
												<p className="fn-index__excerpt">
													{note.deck || stripMarkdown(note.body)}
												</p>
												<div className="fn-index__foot">
													<span className="fn-index__read">{note.readTime} read</span>
													<Link
														to={`/notes/${note.slug}`}
														className="btn btn--outline fn-index__read-btn"
													>
														Read <span className="arrow">→</span>
													</Link>
												</div>
											</article>
										);
									})}
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}

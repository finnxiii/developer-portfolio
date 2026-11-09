import { useEffect, useRef, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SEOHead from "../../components/ui/SEOHead/SEOHead";
import StageSection from "../../components/stage/StageSection";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useQuack } from "../../components/quack/QuackContext";
import { usePointerParallax } from "../../components/stage/usePointerParallax";
import { useSideArtFit } from "../../hooks/useSideArtFit";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import Footer from "../../components/layout/Footer/Footer";
import "./FieldNotes.scss";

const NOTES_QUIPS = [
	"Short reads. Shorter than my attention span.",
	"The TimescaleDB one has the best bugs.",
	"Filter by topic. Or don't. I'm a duck.",
];

function formatDate(iso) {
	if (!iso) return "";
	const d = new Date(iso + "T12:00:00");
	return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" })
		.format(d);
}

// ── Top scene ─────────────────────────────────────────────────────

function NotesTopScene({ notes }) {
	const sceneRef = useRef(null);
	usePointerParallax(sceneRef);
	const logFits = useSideArtFit(360);
	const reduced = useReducedMotion();

	const logLines = notes.slice(0, 8).map(n =>
		`[${n.date}] INFO  notes  published ${n.slug}.md`
	).join("\n");

	return (
		<div className="notes-top-scene" ref={sceneRef}>
			{logFits && (
				<pre
					className={"notes-top-scene__log" + (reduced ? "" : " notes-top-scene__log--rise")}
					aria-hidden="true"
					style={{ transform: "translate(var(--px2,0), var(--py2,0))" }}
				>
					{logLines}
				</pre>
			)}
		</div>
	);
}

// ── List scene ────────────────────────────────────────────────────

function NotesListScene({ notes }) {
	const lsFits = useSideArtFit(240);
	const names = notes.map(n => n.slug + ".md").join("\n");

	return (
		<div className="notes-list-scene">
			{lsFits && (
				<pre className="notes-list-scene__ls" aria-hidden="true">
					{`$ ls notes/\n${names}`}
				</pre>
			)}
		</div>
	);
}

// ── Sections ──────────────────────────────────────────────────────

function NotesTopSection() {
	return (
		<div className="notes-top">
			<span className="notes-top__label">notes/</span>
			<h1 className="notes-top__h1">Field Notes</h1>
			<p className="notes-top__deck">
				Short reads on building, debugging and design decisions.
			</p>
			<a href="#notes-list" className="btn btn--solid">Browse notes ↓</a>
		</div>
	);
}

function NotesListSection({ notes }) {
	const [searchParams, setSearchParams] = useSearchParams();
	const activeTopic = searchParams.get("topic") ?? "All";

	const allTopics = useMemo(
		() => ["All", ...Array.from(new Set(notes.map(n => n.topic).filter(Boolean)))],
		[notes]
	);

	const filtered = activeTopic === "All" ? notes : notes.filter(n => n.topic === activeTopic);
	const count = filtered.length;

	function setTopic(topic) {
		if (topic === "All") {
			setSearchParams(p => { p.delete("topic"); return p; });
		} else {
			setSearchParams({ topic });
		}
	}

	return (
		<div className="notes-list">
			<div className="notes-list__header">
				<h2 className="notes-list__h2">{count} {count === 1 ? "note" : "notes"}</h2>
				{allTopics.length > 2 && (
					<div className="notes-list__chips" role="group" aria-label="Filter by topic">
						{allTopics.map(topic => (
							<button
								key={topic}
								type="button"
								className={"notes-chip" + (activeTopic === topic ? " notes-chip--active" : "")}
								aria-pressed={activeTopic === topic}
								onClick={() => setTopic(topic)}
							>
								{topic}
							</button>
						))}
					</div>
				)}
			</div>

			<div className="notes-rows">
				{filtered.map(note => (
					<Link
						key={note.slug}
						to={`/notes/${note.slug}`}
						className="notes-row"
					>
						<span className="notes-row__bp" aria-hidden="true" />
						<span className="notes-row__date">
							<time dateTime={note.date}>{formatDate(note.date)}</time>
						</span>
						<span className="notes-row__content">
							<span className="notes-row__meta">
								<span className="notes-row__topic">{note.topic}</span>
								<span aria-hidden="true"> · </span>
								<span>{note.readTime} read</span>
							</span>
							<span className="notes-row__title">{note.title}</span>
							{note.deck && (
								<span className="notes-row__deck">{note.deck}</span>
							)}
						</span>
						<span className="notes-row__arrow" aria-hidden="true">→</span>
					</Link>
				))}
			</div>

			<Footer />
		</div>
	);
}

// ── Page ──────────────────────────────────────────────────────────

export default function FieldNotes() {
	const { data } = usePortfolioData();
	const { fieldNotes = [] } = data;
	const { setQuips } = useQuack();

	useEffect(() => {
		setTimeout(() => setQuips(NOTES_QUIPS), 0);
	}, [setQuips]);

	return (
		<>
			<SEOHead
				title="Field Notes"
				description="Short reads on building, debugging and design decisions."
			/>

			<StageSection
				id="notes-top"
				fn="notes()"
				ln="01"
				bg="var(--paper)"
				dark={false}
				scene={<NotesTopScene notes={fieldNotes} />}
			>
				<NotesTopSection />
			</StageSection>

			<StageSection
				id="notes-list"
				fn="readLog()"
				ln="09"
				bg="var(--paper)"
				dark={false}
				scene={<NotesListScene notes={fieldNotes} />}
			>
				<NotesListSection notes={fieldNotes} />
			</StageSection>
		</>
	);
}

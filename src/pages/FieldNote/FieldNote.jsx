import { useEffect, useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import SEOHead from "../../components/ui/SEOHead/SEOHead";
import StageSection from "../../components/stage/StageSection";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useQuack } from "../../components/quack/QuackContext";
import { useChrome } from "../../components/layout/Chrome/ChromeContext";
import { usePointerParallax } from "../../components/stage/usePointerParallax";
import { useSideArtFit } from "../../hooks/useSideArtFit";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import Footer from "../../components/layout/Footer/Footer";
import "./FieldNote.scss";

const NOTE_QUIPS = [
	"Each heading gets its own background. Fancy.",
	"He's on design number five now. Don't tell him.",
	"I liked the doodle one.",
];

// Cycling scene configs for note sections
const SECTION_SCENES = [
	{ bg: "var(--paper)",   dark: false, scene: "gitlog"      },
	{ bg: "#F1EFEA",        dark: false, scene: "wireframe"   },
	{ bg: "#F2EEE6",        dark: false, scene: "columns"     },
	{ bg: "#FBF8F0",        dark: false, scene: "doodle"      },
	{ bg: "var(--paper)",   dark: false, scene: "dotgrid"     },
	{ bg: "var(--warm-scene)", dark: false, scene: "warm"     },
];

function headingToId(text) {
	return "fn-" + text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function headingToFn(text) {
	const words = text.replace(/[^a-zA-Z\s]/g, "").split(/\s+/).filter(Boolean).slice(0, 4);
	return words.map((w, i) =>
		i === 0 ? w.charAt(0).toLowerCase() + w.slice(1).toLowerCase()
		        : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
	).join("") + "()";
}

function formatDate(iso) {
	if (!iso) return "";
	const d = new Date(iso + "T12:00:00");
	return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(d);
}

// Parse note body into sections: intro + one per ## heading
function parseSections(body) {
	if (!body) return [{ id: "intro", heading: null, content: "" }];

	const lines = body.split("\n");
	const sections = [];
	let current = { heading: null, lines: [] };

	for (const line of lines) {
		if (line.startsWith("## ")) {
			sections.push(current);
			current = { heading: line.slice(3).trim(), lines: [] };
		} else {
			current.lines.push(line);
		}
	}
	sections.push(current);

	return sections
		.filter(s => s.heading !== null || s.lines.some(l => l.trim()))
		.map((s, i) => ({
			id: s.heading ? headingToId(s.heading) : "intro",
			heading: s.heading,
			fn: s.heading ? headingToFn(s.heading) : "read()",
			ln: String(1 + i * 4).padStart(2, "0"),
			content: s.lines.join("\n").trim(),
		}));
}

function renderInline(text) {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
		.replace(/\*(.+?)\*/g, "<em>$1</em>")
		.replace(/`(.+?)`/g, "<code>$1</code>");
}

function renderContent(text) {
	const blocks = text.split(/\n\n+/);
	let first = true;
	return blocks.map(block => {
		const trimmed = block.trim();
		if (!trimmed) return "";
		if (trimmed.startsWith("### ")) {
			return `<h3>${renderInline(trimmed.slice(4))}</h3>`;
		}
		const lines = trimmed.split("\n");
		if (lines.every(l => l.startsWith("- "))) {
			const items = lines.map(l => `<li>${renderInline(l.slice(2))}</li>`).join("");
			return `<ul>${items}</ul>`;
		}
		const cls = first ? ' class="fn-note-body__p--first"' : "";
		first = false;
		return `<p${cls}>${renderInline(trimmed.replace(/\n/g, " "))}</p>`;
	}).join("");
}

// ── Scene components ──────────────────────────────────────────────

function GitlogScene() {
	const ref = useRef(null);
	usePointerParallax(ref);
	const fits = useSideArtFit(320);
	return (
		<div className="fn-scene fn-scene--gitlog" ref={ref}>
			{fits && (
				<pre
					className="fn-scene__log"
					aria-hidden="true"
					style={{ transform: "translate(var(--px2,0), var(--py2,0))" }}
				>{`$ git log --oneline -- portfolio/
9f2c1e0 design: editorial, softened
4ab77d3 design: doodle notebook (concept only)
1c0e9a8 design: newspaper × code (6 phases)
77d1b02 design: 3d workspace hero`}</pre>
			)}
		</div>
	);
}

function WireframeScene() {
	const reduced = useReducedMotion();
	const ref = useRef(null);
	usePointerParallax(ref);
	const fits = useSideArtFit(360);
	return (
		<div className="fn-scene" ref={ref}>
			{fits && (
				<svg
					className={"fn-scene__wireframe" + (reduced ? "" : " fn-scene__wireframe--spin")}
					width="360"
					height="360"
					viewBox="-180 -180 360 360"
					aria-hidden="true"
					style={{ transform: "translate(var(--px2,0), 0)" }}
				>
					<g fill="none" stroke="#B3AB9C" strokeWidth="1.5">
						<polygon points="0,-120 104,-60 104,60 0,120 -104,60 -104,-60" />
						<polyline points="-104,-60 0,0 104,-60" />
						<line x1="0" y1="0" x2="0" y2="120" />
						<polygon points="0,-60 52,-30 52,30 0,60 -52,30 -52,-30" stroke="#D9A21E" />
					</g>
				</svg>
			)}
		</div>
	);
}

function ColumnsScene() {
	const ref = useRef(null);
	usePointerParallax(ref);
	return (
		<div className="fn-scene" ref={ref}>
			<div className="fn-scene__rule-top" aria-hidden="true" />
			<div
				className="fn-scene__columns"
				aria-hidden="true"
				style={{ transform: "translate(var(--px2,0), 0)" }}
			>
				<span className="fn-scene__col-rule" />
				<span className="fn-scene__col-rule" />
				<span className="fn-scene__col-rule" />
			</div>
		</div>
	);
}

function DoodleScene() {
	return <div className="fn-scene fn-scene--doodle" />;
}

function DotGridScene() {
	return <div className="fn-scene fn-scene--dotgrid" />;
}

function WarmScene() {
	const reduced = useReducedMotion();
	return (
		<div className="fn-scene fn-scene--warm" aria-hidden="true">
			<div className={"fn-scene__glow fn-scene__glow--1" + (reduced ? " fn-scene__glow--still" : "")} />
			<div className={"fn-scene__glow fn-scene__glow--2" + (reduced ? " fn-scene__glow--still" : "")} />
		</div>
	);
}

const SCENE_COMPONENTS = {
	gitlog:    <GitlogScene />,
	wireframe: <WireframeScene />,
	columns:   <ColumnsScene />,
	doodle:    <DoodleScene />,
	dotgrid:   <DotGridScene />,
	warm:      <WarmScene />,
};

// ── 404 ───────────────────────────────────────────────────────────

function NotFoundScene() {
	return (
		<div
			className="fn-notfound-scene"
			aria-hidden="true"
			style={{
				backgroundImage: "linear-gradient(#E6E0D3 1px, transparent 1px), linear-gradient(90deg, #E6E0D3 1px, transparent 1px)",
				backgroundSize: "28px 28px",
			}}
		/>
	);
}

function NoteNotFound({ slug }) {
	const { setQuips } = useQuack();
	useEffect(() => {
		setTimeout(() => setQuips(["I looked everywhere. Even under the desk."]), 0);
	}, [setQuips]);

	return (
		<>
			<SEOHead title="Note not found" />
			<StageSection
				id="note-notfound"
				fn="read()"
				ln="01"
				bg="var(--graph)"
				dark={false}
				scene={<NotFoundScene />}
			>
				<div className="fn-notfound">
					<span className="fn-notfound__label">Exception in thread main</span>
					<h1 className="fn-notfound__h1">Class<wbr />Not<wbr />Found<wbr />Exception</h1>
					<p className="fn-notfound__body">
						There's no field note called{" "}
						<code className="fn-notfound__code">{slug}.md</code>.
					</p>
					<Link to="/notes" className="btn btn--solid">← notes/</Link>
				</div>
			</StageSection>
		</>
	);
}

// ── Page ──────────────────────────────────────────────────────────

export default function FieldNote() {
	const { slug } = useParams();
	const { data } = usePortfolioData();
	const { fieldNotes = [] } = data;
	const { setQuips } = useQuack();
	const { registerTab, unregisterTab } = useChrome();

	const note = fieldNotes.find(n => n.slug === slug) ?? null;

	useEffect(() => {
		setTimeout(() => setQuips(note ? NOTE_QUIPS : []), 0);
	}, [note, setQuips]);

	useEffect(() => {
		if (!note) return;
		const label = `${slug}.md`;
		registerTab({ label, to: `/notes/${slug}`, current: true });
		return () => unregisterTab();
	}, [slug, note, registerTab, unregisterTab]);

	const sections = useMemo(() => parseSections(note?.body ?? ""), [note]);

	if (!note) return <NoteNotFound slug={slug} />;

	const { title, date, topic, readTime, deck } = note;
	const noteIdx = fieldNotes.findIndex(n => n.slug === slug);
	const prev = noteIdx > 0 ? fieldNotes[noteIdx - 1] : null;
	const next = noteIdx < fieldNotes.length - 1 ? fieldNotes[noteIdx + 1] : null;

	return (
		<>
			<SEOHead
				title={title}
				description={deck ?? `${topic} · ${readTime} read`}
			/>

			{sections.map((sec, i) => {
				const isLast = i === sections.length - 1;
				const sceneIdx = isLast ? SECTION_SCENES.length - 1 : i % (SECTION_SCENES.length - 1);
				const { bg, dark, scene: sceneKey } = SECTION_SCENES[sceneIdx];

				return (
					<StageSection
						key={sec.id}
						id={sec.id}
						fn={sec.fn}
						ln={sec.ln}
						bg={bg}
						dark={dark}
						scene={SCENE_COMPONENTS[sceneKey]}
					>
						<article className={"fn-note" + (dark ? " fn-note--dark" : "")}>
							{i === 0 && (
								<header className="fn-note__header">
									<nav className="fn-note__crumb" aria-label="Breadcrumb">
										<Link to="/notes" className="fn-note__crumb-link">notes/</Link>
										<span aria-hidden="true"> › </span>
										<span className="fn-note__crumb-current">{slug}.md</span>
									</nav>
									<span className="fn-note__meta">
										<span className="fn-note__topic">{topic}</span>
										<span aria-hidden="true"> · </span>
										<time dateTime={date}>{formatDate(date)}</time>
										<span aria-hidden="true"> · </span>
										<span>{readTime} read</span>
									</span>
									<h1 className="fn-note__h1">{title}</h1>
									{deck && <p className="fn-note__deck">{deck}</p>}
								</header>
							)}

							{sec.heading && (
								<h2 className="fn-note__h2" id={sec.id}>
									{sec.heading}
								</h2>
							)}

							{sec.content && (
								<div
									className="fn-note__body"
									dangerouslySetInnerHTML={{ __html: renderContent(sec.content) }}
								/>
							)}

							{isLast && (
								<nav className="fn-note__pager" aria-label="Notes navigation">
									{prev && (
										<Link to={`/notes/${prev.slug}`} className="fn-note__pager-btn fn-note__pager-btn--prev">
											<span className="fn-note__pager-dir">← previous</span>
											<span className="fn-note__pager-title">{prev.title}</span>
										</Link>
									)}
									{next && (
										<Link to={`/notes/${next.slug}`} className="fn-note__pager-btn fn-note__pager-btn--next">
											<span className="fn-note__pager-dir">next →</span>
											<span className="fn-note__pager-title">{next.title}</span>
										</Link>
									)}
								</nav>
							)}

							{isLast && <Footer />}
						</article>
					</StageSection>
				);
			})}
		</>
	);
}

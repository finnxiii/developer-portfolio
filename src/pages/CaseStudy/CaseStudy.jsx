import { useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import SEOHead from "../../components/ui/SEOHead/SEOHead";
import StageSection from "../../components/stage/StageSection";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useQuack } from "../../components/quack/QuackContext";
import { useChrome } from "../../components/layout/Chrome/ChromeContext";
import { usePointerParallax } from "../../components/stage/usePointerParallax";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useSideArtFit } from "../../hooks/useSideArtFit";
import { FIGURES } from "../../components/figures/index";
import Footer from "../../components/layout/Footer/Footer";
import "./CaseStudy.scss";

// ── Helpers ───────────────────────────────────────────────────────

function slugToPascalCase(slug = "") {
	return slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("");
}

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

// ── Scenes ────────────────────────────────────────────────────────

function IntroScene({ slug }) {
	const FigureComponent = FIGURES[slug];
	const sceneRef = useRef(null);
	usePointerParallax(sceneRef);
	const figFits = useSideArtFit(300);

	if (!FigureComponent) return <div className="cs-scene cs-scene--intro" />;

	return (
		<div className="cs-scene cs-scene--intro" ref={sceneRef}>
			{figFits && (
				<div
					className="cs-intro-figure scene-side"
					style={{ transform: "translate(var(--px2,0), var(--py2,0))" }}
				>
					<FigureComponent compact />
				</div>
			)}
		</div>
	);
}

function ProblemScene({ scene }) {
	const sceneRef = useRef(null);
	usePointerParallax(sceneRef);
	const reproduce = scene?.reproduce;
	const termFits = useSideArtFit(400);

	return (
		<div className="cs-scene cs-scene--problem" ref={sceneRef}>
			<div className="cs-scene__scanline" aria-hidden="true" />
			{reproduce && termFits && (
				<div
					className="cs-problem-term scene-side"
					style={{ transform: "translate(var(--px2,0), var(--py2,0))" }}
					aria-hidden="true"
				>
					<div className="term-bar term-bar--light">
						<span className="term-bar__dot term-bar__dot--muted" />
						<span className="term-bar__dot term-bar__dot--muted" />
						<span className="term-bar__dot term-bar__dot--muted" />
						<span style={{ marginLeft: 6 }}>reproduce.sh</span>
					</div>
					<pre className="cs-problem-term__body">
						{reproduce.join("\n")}
					</pre>
				</div>
			)}
		</div>
	);
}

function InspectScene({ scene }) {
	const sceneRef = useRef(null);
	usePointerParallax(sceneRef);
	const watches = scene?.watches;
	const watchesFits = useSideArtFit(430);

	return (
		<div className="cs-scene cs-scene--inspect" ref={sceneRef}>
			{watches && watchesFits && (
				<div
					className="cs-watches-panel scene-side"
					style={{ transform: "translate(var(--px2,0), var(--py2,0))" }}
					aria-hidden="true"
				>
					<div className="term-bar term-bar--light">
						<span className="term-bar__dot term-bar__dot--muted" />
						<span className="term-bar__dot term-bar__dot--muted" />
						<span className="term-bar__dot term-bar__dot--muted" />
						<span style={{ marginLeft: 6 }}>Watches</span>
					</div>
					<pre className="cs-watches-panel__body">
						{watches.map(([k, v]) => `${k.padEnd(14)}= ${v}`).join("\n")}
					</pre>
				</div>
			)}
		</div>
	);
}

function FixScene({ scene }) {
	const sceneRef = useRef(null);
	usePointerParallax(sceneRef);
	const diff = scene?.diff;
	const diffFits = useSideArtFit(470);

	return (
		<div className="cs-scene cs-scene--fix" ref={sceneRef}>
			{diff && diffFits && (
				<div
					className="cs-diff scene-side"
					style={{ transform: "translate(var(--px2,0), var(--py2,0))" }}
					aria-hidden="true"
				>
					{diff.map((line, i) => (
						<div
							key={i}
							className={`cs-diff__line cs-diff__line--${line.sign === "+" ? "add" : "del"}`}
						>
							{line.sign} {line.text}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

function BrokeScene({ scene }) {
	const sceneRef = useRef(null);
	usePointerParallax(sceneRef);
	const exceptions = scene?.exceptions;
	const exceptFits = useSideArtFit(350);

	return (
		<div className="cs-scene cs-scene--broke" ref={sceneRef}>
			{exceptions && exceptFits && (
				<pre
					className="cs-exceptions scene-side"
					style={{ transform: "translate(var(--px2,0), var(--py2,0))" }}
					aria-hidden="true"
				>
					{exceptions.join("\n")}
				</pre>
			)}
		</div>
	);
}

function OutcomeScene() {
	const prefersReduced = useReducedMotion();
	const ticks = Array.from({ length: 60 }, (_, i) =>
		(i % 3 === 0 ? "✓ " : (i % 3 === 1 ? "✓ " : "  "))
	).join("");

	return (
		<div className="cs-scene cs-scene--outcome">
			<pre
				className="cs-ticks"
				aria-hidden="true"
				style={prefersReduced ? { animation: "none" } : undefined}
			>
				{ticks.repeat(4)}
			</pre>
		</div>
	);
}

function LearnedScene() {
	return (
		<div className="cs-scene cs-scene--learned">
			<div className="cs-glow cs-glow--a" aria-hidden="true" />
			<div className="cs-glow cs-glow--b" aria-hidden="true" />
		</div>
	);
}

function NotFoundScene() {
	return (
		<div className="cs-scene cs-scene--problem">
			<div className="cs-scene__scanline" aria-hidden="true" />
		</div>
	);
}

// ── Sections ──────────────────────────────────────────────────────

function IntroSection({ project, slug }) {
	const { title, deck, category, status, numbers = [], stack = [], github, sections } = project;
	const readTime = calcReadTime(sections);

	return (
		<div className="cs-intro">
			<Link to="/work" className="cs-breadcrumb">
				Work.java › <span className="cs-breadcrumb__current">{slugToPascalCase(slug)}.java</span>
			</Link>
			<span className="cs-kicker">{category} · {status}</span>
			<h1 className="cs-title">{title}</h1>
			{deck && <p className="cs-deck">{deck}</p>}

			{numbers.length > 0 && (
				<div className="cs-numbers">
					{numbers.map((n, i) => (
						<div key={i} className="cs-number">
							<span className="cs-number__val">{n.value}</span>
							<span className="cs-number__label">{n.label}</span>
						</div>
					))}
				</div>
			)}

			<div className="cs-meta">
				<span>role · {project.role}</span>
				<span>{project.timeframe}</span>
				<span>{project.team}</span>
			</div>

			{stack.length > 0 && (
				<div className="cs-stack">
					{stack.map((s) => (
						<span key={s} className="cs-stack__tag">{s}</span>
					))}
				</div>
			)}

			<div className="cs-intro-ctas">
				{github && (
					<a
						href={github}
						className="btn btn--solid"
						target="_blank"
						rel="noopener noreferrer"
					>
						GitHub ↗
					</a>
				)}
				<a href="#cs-problem" className="btn btn--outline">Read it ↓</a>
			</div>

			<p className="cs-read-meta">{readTime} min read</p>
		</div>
	);
}

function CsSectionContent({ mono, h2, children, dark = false }) {
	return (
		<div className="cs-section-content">
			<span className={`cs-mono-label${dark ? " cs-mono-label--dark" : ""}`}>{mono}</span>
			<h2 className={`cs-h2${dark ? " cs-h2--dark" : ""}`}>{h2}</h2>
			<div className={`cs-body${dark ? " cs-body--dark" : ""}`}>{children}</div>
		</div>
	);
}

function LearnedSection({ project, next }) {
	return (
		<div className="cs-section-content">
			<span className="cs-mono-label">06 · retro</span>
			<h2 className="cs-h2">What I learned</h2>
			<div className="cs-body">
				{renderBody(project.sections?.learned)}
			</div>

			{next && (
				<Link to={`/work/${next.slug}`} className="cs-next-row">
					<span className="cs-next-row__bp" aria-hidden="true" />
					<span className="cs-next-row__label">next</span>
					<span className="cs-next-row__title">{next.title}</span>
					<span className="cs-next-row__arrow" aria-hidden="true">→</span>
				</Link>
			)}

			<Footer />
		</div>
	);
}

// ── 404 page ──────────────────────────────────────────────────────

function NotFoundPage({ slug }) {
	const { setQuips } = useQuack();

	useEffect(() => {
		setTimeout(() => setQuips(["I looked everywhere. Even under the desk."]), 0);
	}, [setQuips]);

	return (
		<>
			<SEOHead title={`${slug} — Not found`} />
			<StageSection
				id="not-found"
				fn="notFound()"
				ln="01"
				bg="var(--graph)"
				dark={false}
				scene={<NotFoundScene />}
			>
				<div className="cs-not-found">
					<span className="cs-mono-label">Exception in thread main</span>
					<h1 className="cs-not-found__h1">ClassNotFoundException</h1>
					<p className="cs-not-found__body">
						There&rsquo;s no case study called <code className="cs-not-found__code">{slug}</code>.
					</p>
					<Link to="/work" className="btn btn--solid">← Work.java</Link>
				</div>
			</StageSection>
		</>
	);
}

// ── Page ──────────────────────────────────────────────────────────

const CASE_QUIPS = [
	"The 'what broke' bit is the best bit.",
	"TimescaleDB gave him three bugs in one week. I was there.",
	"Losing a location is fine. Losing me is not.",
];

export default function CaseStudy() {
	const { slug } = useParams();
	const { data } = usePortfolioData();
	const { projects = [] } = data;
	const { setQuips } = useQuack();
	const { registerTab, unregisterTab } = useChrome();

	const idx = projects.findIndex((p) => p.slug === slug);
	const project = projects[idx] ?? null;
	const next = idx >= 0 && idx < projects.length - 1 ? projects[idx + 1] : null;

	useEffect(() => {
		setTimeout(() => setQuips(project ? CASE_QUIPS : []), 0);
	}, [project, setQuips]);

	useEffect(() => {
		if (!project) return;
		const label = slugToPascalCase(slug) + ".java";
		registerTab({ label, to: `/work/${project.slug}` });
		return () => unregisterTab();
	}, [project, slug, registerTab, unregisterTab]);

	if (!project) {
		return <NotFoundPage slug={slug} />;
	}

	const { sections = {}, scene } = project;

	return (
		<>
			<SEOHead
				title={project.title}
				description={project.deck ? `${project.deck} Case study.` : undefined}
			/>

			<StageSection
				id="cs-intro"
				fn={`${slugToPascalCase(slug).toLowerCase()}()`}
				ln="01"
				bg="var(--paper)"
				dark={false}
				scene={<IntroScene slug={slug} />}
			>
				<IntroSection project={project} slug={slug} />
			</StageSection>

			{sections.problem && (
				<StageSection
					id="cs-problem"
					fn="reproduce()"
					ln="08"
					bg="var(--graph)"
					dark={false}
					scene={<ProblemScene scene={scene} />}
				>
					<CsSectionContent mono="01 · reproduce" h2="The problem">
						{renderBody(sections.problem)}
					</CsSectionContent>
				</StageSection>
			)}

			{sections.investigation && (
				<StageSection
					id="cs-inspect"
					fn="inspect()"
					ln="16"
					bg="var(--paper-2)"
					dark={false}
					scene={<InspectScene scene={scene} />}
				>
					<CsSectionContent mono="02 · inspect" h2="Investigation">
						{renderBody(sections.investigation)}
					</CsSectionContent>
				</StageSection>
			)}

			{sections.implementation && (
				<StageSection
					id="cs-fix"
					fn="fix()"
					ln="24"
					bg="var(--paper)"
					dark={false}
					scene={<FixScene scene={scene} />}
				>
					<CsSectionContent mono="03 · fix" h2="Implementation">
						{renderBody(sections.implementation)}
					</CsSectionContent>
				</StageSection>
			)}

			{sections.whatBroke && (
				<StageSection
					id="cs-broke"
					fn="catchException()"
					ln="33"
					bg="var(--soft-red-scene)"
					dark={false}
					scene={<BrokeScene scene={scene} />}
				>
					<CsSectionContent mono="04 · catch (Exception e)" h2="What broke">
						{renderBody(sections.whatBroke)}
						{project.pullQuote && (
							<blockquote className="cs-pullquote">
								&ldquo;{project.pullQuote}&rdquo;
							</blockquote>
						)}
					</CsSectionContent>
				</StageSection>
			)}

			{sections.outcome && (
				<StageSection
					id="cs-outcome"
					fn="assertWorks()"
					ln="41"
					bg="var(--dark-scene)"
					dark={true}
					scene={<OutcomeScene />}
				>
					<CsSectionContent mono="05 · assert" h2="Outcome" dark>
						{renderBody(sections.outcome)}
					</CsSectionContent>
				</StageSection>
			)}

			<StageSection
				id="cs-learned"
				fn="retro()"
				ln="49"
				bg="var(--warm-scene)"
				dark={false}
				scene={<LearnedScene />}
			>
				<LearnedSection project={project} next={next} />
			</StageSection>
		</>
	);
}

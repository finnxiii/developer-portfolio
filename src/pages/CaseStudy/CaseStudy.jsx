import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SEOHead from "../../components/ui/SEOHead/SEOHead";
import StageSection from "../../components/stage/StageSection";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useQuack } from "../../components/quack/QuackContext";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { FIGURES } from "../../components/figures/index";
import Cmd from "../../components/ui/Cmd/Cmd";
import Footer from "../../components/layout/Footer/Footer";
import "./CaseStudy.scss";

// ── Helpers ───────────────────────────────────────────────────────

function firstSentence(text = "") {
	const m = text.match(/^[^.!?]+[.!?]/);
	return m ? m[0] : text.slice(0, 200);
}

function restOf(text = "") {
	const m = text.match(/^[^.!?]+[.!?]\s*/);
	return m ? text.slice(m[0].length).trim() : "";
}

function renderBody(text) {
	if (!text) return null;
	return text.split(/\n\n+/).filter(Boolean).map((p, i) => <p key={i}>{p}</p>);
}

function statFileName(label = "", idx) {
	const exts = [".log", ".cfg", ".txt", ".json"];
	const words = label
		.replace(/[^a-zA-Z0-9 ]/g, "")
		.split(/\s+/)
		.slice(0, 2)
		.join("_")
		.toLowerCase();
	return (words || `stat_${idx}`) + exts[idx % 4];
}

function statusLabel(status) {
	if (status === "Completed") return "passed";
	if (status === "Prototype") return "prototype";
	return "running";
}

// ── Scenes ────────────────────────────────────────────────────────

function IntroScene() {
	return (
		<div className="cs2-intro-scene">
			<pre className="cs2-gutter-nums" aria-hidden="true">
				{Array.from({ length: 60 }, (_, i) => i + 1).join("\n")}
			</pre>
		</div>
	);
}

function SessionScene() {
	return (
		<div className="cs2-session-scene">
			<div className="cs2-scanline" aria-hidden="true" />
		</div>
	);
}

function ResultsScene({ exceptions }) {
	return (
		<div className="cs2-results-scene">
			{exceptions?.length > 0 && (
				<pre className="cs2-exceptions" aria-hidden="true">
					{exceptions.join("\n")}
				</pre>
			)}
		</div>
	);
}

function RetroScene() {
	const reduced = useReducedMotion();
	return (
		<div className="cs2-retro-scene">
			<div className={"cs2-glow cs2-glow--a" + (reduced ? " cs2-glow--still" : "")} aria-hidden="true" />
			<div className={"cs2-glow cs2-glow--b" + (reduced ? " cs2-glow--still" : "")} aria-hidden="true" />
		</div>
	);
}

// ── Collapsible window ────────────────────────────────────────────

function CWin({ label, h3, text, error = false, dark = false, defaultOpen = false }) {
	const [open, setOpen] = useState(defaultOpen);
	const lead = firstSentence(text);
	const rest = restOf(text);

	const tbarCls = "cwin-tbar" + (error ? " cwin-tbar--err" : dark ? " cwin-tbar--dark" : "");
	const winCls = "cwin" + (error ? " cwin--err" : dark ? " cwin--dark" : "");

	return (
		<div className={winCls}>
			<div className={tbarCls}>
				<i /><i /><i />
				<span>{label}</span>
			</div>
			<div className="cwin-body">
				<span className="cwin-label">{label.replace(/^\d+ · /, "")}</span>
				<h3 className="cwin-title">{h3}</h3>
				{lead && <p className="cwin-lead">{lead}</p>}
				{rest && (
					<div className={"cwin-rest-wrap" + (open ? " cwin-rest-wrap--open" : "")}>
						<div className="cwin-rest-inner">
							<div className="cwin-rest">
								{renderBody(rest)}
							</div>
						</div>
					</div>
				)}
				{rest && (
					<button
						type="button"
						className="cwin-more"
						onClick={() => setOpen(o => !o)}
						aria-expanded={open}
					>
						{open ? "▴ hide full log" : "▾ show full log"}
					</button>
				)}
			</div>
		</div>
	);
}

// ── 404 ──────────────────────────────────────────────────────────

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
				scene={<div className="cs2-session-scene"><div className="cs2-scanline" /></div>}
			>
				<div className="cs2-notfound">
					<span className="cs2-label">Exception in thread main</span>
					<h1 className="cs2-notfound__h1">ClassNotFoundException</h1>
					<p>There&rsquo;s no case study called <code>{slug}</code>.</p>
					<Cmd glyph="←" href="/#work" variant="dark">cd ../caseStudies</Cmd>
				</div>
			</StageSection>
		</>
	);
}

// ── Page ──────────────────────────────────────────────────────────

const CASE_QUIPS = [
	"The 'what broke' window is the best one.",
	"Click 'show full log'. He wrote a lot.",
	"cd ../caseStudies takes you home.",
];

export default function CaseStudy() {
	const { slug } = useParams();
	const { data } = usePortfolioData();
	const { projects = [] } = data;
	const { setQuips } = useQuack();

	const idx = projects.findIndex(p => p.slug === slug);
	const project = projects[idx] ?? null;
	const next = idx >= 0 && idx < projects.length - 1 ? projects[idx + 1] : null;

	useEffect(() => {
		setTimeout(() => setQuips(project ? CASE_QUIPS : []), 0);
	}, [project, setQuips]);

	if (!project) return <NotFoundPage slug={slug} />;

	const {
		title, deck, category, status, role, timeframe, team,
		stack = [], github, live, numbers = [], sections = {}, scene, pullQuote,
	} = project;

	const FigureComponent = FIGURES[slug] ?? null;
	const nextTitle = next ? next.title.split(/\s*[-–]\s*/)[0].trim() : "";
	const slugTitle = title.split(/\s*[-–]\s*/)[0].trim();
	const statusStr = statusLabel(status);

	return (
		<>
			<SEOHead
				title={title}
				description={deck ? `${deck} Case study.` : undefined}
			/>

			{/* ── 01 · Intro ─────────────────────────────────────────── */}
			<StageSection
				id="cs-intro"
				fn={`${slug.replace(/-/g, "")}()`}
				ln="01"
				bg="var(--paper)"
				dark={false}
				scene={<IntroScene />}
			>
				<div className="cs2-intro">
					<div className="cs2-intro-l">
						<Cmd glyph="←" href="/#work" variant="ghost" className="cs2-back">cd ../caseStudies</Cmd>
						<span className="cs2-label">
							{category} · <span className={"cs2-status cs2-status--" + statusStr}>● {statusStr}</span>
						</span>
						<h1 className="cs2-h1" tabIndex={-1}>{slugTitle}</h1>
						{deck && <p className="cs2-deck">{deck}</p>}
						<div className="cs2-meta">
							{role && <span>{role}</span>}
							{timeframe && <span>{timeframe}</span>}
							{team && <span>{team}</span>}
						</div>
						{stack.length > 0 && (
							<div className="cs2-chips">
								{stack.map(s => <span key={s}>{s}</span>)}
							</div>
						)}
						<div className="cs2-ctas">
							{github && (
								<Cmd glyph="↗" variant="dark" href={github} target="_blank" rel="noopener noreferrer">
									open github
								</Cmd>
							)}
							{live && (
								<Cmd glyph="↗" variant="dark" href={live} target="_blank" rel="noopener noreferrer">
									open live
								</Cmd>
							)}
							<Cmd glyph="▶" href="#cs-session">run session</Cmd>
						</div>
					</div>

					{FigureComponent && (
						<div className="cwin cs2-arch-win">
							<div className="cwin-tbar">
								<i /><i /><i />
								<span>architecture.svg</span>
							</div>
							<FigureComponent />
						</div>
					)}
				</div>

				{numbers.length > 0 && (
					<div className="cs2-stats">
						{numbers.map((n, i) => (
							<div key={i} className="cwin cs2-stat">
								<div className="cwin-tbar">
									<i /><i /><i />
									<span>{statFileName(n.label, i)}</span>
								</div>
								<div className="cs2-stat-body">
									<span className="cs2-stat-val">{n.value}</span>
									<span className="cs2-stat-label">{n.label}</span>
								</div>
							</div>
						))}
					</div>
				)}
			</StageSection>

			{/* ── 02 · Debug session ─────────────────────────────────── */}
			<StageSection
				id="cs-session"
				fn="debugSession()"
				ln="08"
				bg="var(--graph)"
				dark={false}
				scene={<SessionScene />}
			>
				<div className="cs2-session-hd">
					<h2 className="cs2-h2">Debug session</h2>
					<span className="cs2-session-hint">3 steps · click &ldquo;show full log&rdquo; for the details</span>
				</div>
				<div className="cs2-session">
					{sections.problem && (
						<>
							<div className="cs2-rail"><div className="cs2-sdot" /></div>
							<div>
								<CWin label="01 · reproduce.md" h3="The problem" text={sections.problem} />
							</div>
						</>
					)}
					{sections.investigation && (
						<>
							<div className="cs2-rail"><div className="cs2-sdot" /></div>
							<div>
								<CWin label="02 · inspect.md" h3="Investigation" text={sections.investigation} />
							</div>
						</>
					)}
					{sections.implementation && (
						<>
							<div className="cs2-rail"><div className="cs2-sdot" /></div>
							<div>
								<CWin label="03 · fix.md" h3="Implementation" text={sections.implementation} />
							</div>
						</>
					)}
				</div>
			</StageSection>

			{/* ── 03 · Results ────────────────────────────────────────── */}
			<StageSection
				id="cs-results"
				fn="results()"
				ln="24"
				bg="var(--soft-red-scene)"
				dark={false}
				scene={<ResultsScene exceptions={scene?.exceptions} />}
			>
				<h2 className="cs2-h2" style={{ marginBottom: "22px" }}>What broke, and what works</h2>
				<div className="cs2-fails">
					{sections.whatBroke && (
						<CWin label="04 · catch.md" h3="What broke" text={sections.whatBroke} error />
					)}
					{sections.outcome && (
						<CWin label="05 · assert.md" h3="Outcome" text={sections.outcome} dark />
					)}
				</div>
				{pullQuote && (
					<blockquote className="cs2-pullquote">&ldquo;{pullQuote}&rdquo;</blockquote>
				)}
			</StageSection>

			{/* ── 04 · Retro ──────────────────────────────────────────── */}
			<StageSection
				id="cs-retro"
				fn="retro()"
				ln="40"
				bg="var(--warm-scene)"
				dark={false}
				scene={<RetroScene />}
			>
				{sections.learned && (
					<CWin label="06 · retro.md" h3="What I learned" text={sections.learned} defaultOpen />
				)}
				<div className="cs2-cnav">
					<Cmd glyph="←" href="/#work" variant="dark">cd ../caseStudies</Cmd>
					{next && (
						<Cmd glyph="→" href={`/work/${next.slug}`}>open {nextTitle}.java</Cmd>
					)}
					<Cmd glyph="⌂" href="/" variant="ghost">Finn.java</Cmd>
				</div>
				<Footer />
			</StageSection>
		</>
	);
}

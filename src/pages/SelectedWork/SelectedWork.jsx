import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SEOHead from "../../components/ui/SEOHead/SEOHead";
import StageSection from "../../components/stage/StageSection";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useQuack } from "../../components/quack/QuackContext";
import { usePointerParallax } from "../../components/stage/usePointerParallax";
import { useSideArtFit } from "../../hooks/useSideArtFit";
import Footer from "../../components/layout/Footer/Footer";
import "./SelectedWork.scss";

const WORK_QUIPS = [
	"Pick one. I'll wait.",
	"Vigil is still running. Like me.",
	"Each one has a 'what broke' section. My favourite part.",
];

function statusBadge(status = "") {
	const s = status.toLowerCase();
	if (s.includes("development") || s.includes("running")) {
		return { text: `● running · ${status.toLowerCase()}`, bg: "#FFF4CC", fg: "#7A5A00" };
	}
	if (s.includes("prototype")) {
		return { text: `✓ passed · prototype`, bg: "#E3F3E7", fg: "#1C4A2A" };
	}
	return { text: `✓ passed · ${status.toLowerCase()}`, bg: "#E3F3E7", fg: "#1C4A2A" };
}

// ── Top scene ─────────────────────────────────────────────────────

function WorkTopScene({ projects }) {
	const sceneRef = useRef(null);
	usePointerParallax(sceneRef);
	const reportFits = useSideArtFit(380);

	return (
		<div className="wt-scene" ref={sceneRef}>
			<div className="wt-scene__scanline" aria-hidden="true" />
			{reportFits && (
				<div className="wt-scene__report scene-side" aria-hidden="true"
					style={{ transform: "translate(var(--px2,0), var(--py2,0))" }}>
					<div className="term-bar term-bar--light">
						<span className="term-bar__dot term-bar__dot--muted" />
						<span className="term-bar__dot term-bar__dot--muted" />
						<span className="term-bar__dot term-bar__dot--muted" />
						<span style={{ marginLeft: 6 }}>test report</span>
					</div>
					<pre className="wt-scene__report-body">
						{`Suites       ${projects.length}
Passed       ${projects.filter(p => !p.status?.toLowerCase().includes("development")).length}
Running      ${projects.filter(p => p.status?.toLowerCase().includes("development")).length}

`}
						{projects.map((p, i) => {
							const name = p.title.length > 22 ? p.title.slice(0, 21) + "…" : p.title;
							const dots = ".".repeat(Math.max(2, 24 - name.length));
							const st = p.status?.toLowerCase().includes("development") ? " running" : " passed";
							return name + dots + st + (i < projects.length - 1 ? "\n" : "");
						})}
					</pre>
				</div>
			)}
		</div>
	);
}

// ── List scene ────────────────────────────────────────────────────

function WorkListScene() {
	const lsFits = useSideArtFit(220);
	return (
		<div className="wl-scene">
			{lsFits && (
				<pre className="wl-scene__ls scene-side" aria-hidden="true">{`$ ls work/
vigil/
meeting-cost-calculator/
sorts/`}</pre>
			)}
		</div>
	);
}

// ── Sections ──────────────────────────────────────────────────────

function WorkTopSection() {
	const listId = "work-list";
	return (
		<div className="work-top-section">
			<span className="wt-label">Work.java</span>
			<h1 className="wt-h1">Work</h1>
			<p className="wt-deck">
				Each project is written up as a case study: the problem, what I investigated, what I built, what broke, and what I learned.
			</p>
			<a href={`#${listId}`} className="btn btn--solid">Run all ↓</a>
		</div>
	);
}

function WorkListSection({ projects }) {
	const count = projects.length;
	const orderedProjects = [
		...projects.filter(p => p.leadProject),
		...projects.filter(p => !p.leadProject),
	];

	return (
		<div className="work-list-section">
			<div className="work-list-section__header">
				<h2 className="wl-h2">{count} case {count === 1 ? "study" : "studies"}</h2>
				<span className="wl-hint">hover to set a breakpoint</span>
			</div>

			{orderedProjects.map((p, i) => {
				const badge = statusBadge(p.status);
				const num = String(i + 1).padStart(2, "0");
				return (
					<Link
						key={p.slug}
						to={`/work/${p.slug}`}
						className="work-row"
					>
						<span className="work-row__bp" aria-hidden="true" />
						<span className="work-row__num fp-label">{num}</span>
						<span className="work-row__content">
							<span className="fp-label" style={{ color: "var(--amber-text)" }}>{p.category}</span>
							<span className="work-row__title">{p.title}</span>
							<span className="work-row__deck">{p.deck}</span>
							<span className="fp-label">{p.timeframe}</span>
						</span>
						<span
							className="work-row__badge"
							style={{ background: badge.bg, color: badge.fg }}
						>
							{badge.text}
						</span>
					</Link>
				);
			})}

			<Footer />
		</div>
	);
}

// ── Page ──────────────────────────────────────────────────────────

export default function SelectedWork() {
	const { data } = usePortfolioData();
	const { projects = [] } = data;
	const { setQuips } = useQuack();

	useEffect(() => { setQuips(WORK_QUIPS); }, [setQuips]);

	return (
		<>
			<SEOHead
				title="Selected Work"
				description="Engineering projects and case studies — problem, decisions, and outcome documented in plain language."
			/>

			<StageSection
				id="work-top"
				fn="work()"
				ln="01"
				bg="var(--graph)"
				dark={false}
				scene={<WorkTopScene projects={projects} />}
			>
				<WorkTopSection />
			</StageSection>

			<StageSection
				id="work-list"
				fn="runAll()"
				ln="14"
				bg="var(--paper)"
				dark={false}
				scene={<WorkListScene />}
			>
				<WorkListSection projects={projects} />
			</StageSection>
		</>
	);
}

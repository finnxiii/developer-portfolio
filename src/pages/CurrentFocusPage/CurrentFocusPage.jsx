import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SEOHead from "../../components/ui/SEOHead/SEOHead";
import StageSection from "../../components/stage/StageSection";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useQuack } from "../../components/quack/QuackContext";
import { usePointerParallax } from "../../components/stage/usePointerParallax";
import { useSideArtFit } from "../../hooks/useSideArtFit";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import Footer from "../../components/layout/Footer/Footer";
import "./CurrentFocusPage.scss";

const NOW_QUIPS = [
	"He updates this more than he updates me.",
	"Redis Streams. Sounds like a river. It isn't.",
	"Compose is Kotlin, not Java. I forgave him.",
];

// ── Scenes ────────────────────────────────────────────────────────

function NowTopScene({ currentFocus }) {
	const ref = useRef(null);
	usePointerParallax(ref);
	const fits = useSideArtFit(280);

	const { date, buildingShort, learningShort, exploringShort } = currentFocus ?? {};
	const dateTag = date
		? date.replace(/\s+/, "-").toLowerCase().slice(0, 7)
		: "";

	return (
		<div className="now-top-scene" ref={ref}>
			{fits && (
				<pre
					className="now-top-scene__log"
					aria-hidden="true"
					style={{ transform: "translate(var(--px2,0), var(--py2,0))" }}
				>
					{`==> Now.log <==\n[${dateTag}] building   ${(buildingShort ?? "").toLowerCase()}\n[${dateTag}] learning   ${(learningShort ?? "").toLowerCase()}\n[${dateTag}] exploring  ${(exploringShort ?? "").toLowerCase()}\n_`}
				</pre>
			)}
		</div>
	);
}

function NowBuildingScene() {
	const ref = useRef(null);
	usePointerParallax(ref);
	const reduced = useReducedMotion();

	return (
		<div className="now-building-scene" ref={ref}>
			<div
				className="now-building-scene__streams"
				aria-hidden="true"
				style={{ transform: "translate(var(--px,0), 0)" }}
			>
				{[
					{ c: "rgba(63,111,176,0.5)",   dur: "1.6s" },
					{ c: "rgba(176,108,18,0.5)",   dur: "2.2s" },
					{ c: "rgba(62,132,86,0.5)",    dur: "1.3s" },
					{ c: "rgba(176,108,18,0.35)",  dur: "2.8s" },
					{ c: "rgba(63,111,176,0.35)",  dur: "1.9s" },
				].map((stream, i) => (
					<span
						key={i}
						className={"now-stream" + (reduced ? "" : " now-stream--flow")}
						style={{
							"--stream-c": stream.c,
							"--stream-dur": stream.dur,
						}}
					/>
				))}
			</div>
		</div>
	);
}

function NowLearningScene() {
	const ref = useRef(null);
	usePointerParallax(ref);
	const fits = useSideArtFit(300);
	const reduced = useReducedMotion();

	return (
		<div className="now-learning-scene" ref={ref}>
			{fits && (
				<div
					className={"now-phone" + (reduced ? "" : " now-phone--drift")}
					aria-hidden="true"
					style={{ transform: "translate(var(--px2,0), var(--py2,0))" }}
				>
					<span className="now-phone__header" />
					<span className="now-phone__card now-phone__card--yellow" />
					<span className="now-phone__row" />
					<span className="now-phone__row" />
					<span className="now-phone__row now-phone__row--toggle" />
					<span className="now-phone__btn" />
				</div>
			)}
		</div>
	);
}

function NowExploringScene() {
	const reduced = useReducedMotion();
	return (
		<div className="now-exploring-scene" aria-hidden="true">
			<div className={"now-floor" + (reduced ? " now-floor--still" : "")} />
		</div>
	);
}

// ── Sections ──────────────────────────────────────────────────────

function NowTopSection({ currentFocus }) {
	const { date } = currentFocus ?? {};
	return (
		<div className="now-top">
			<span className="now-top__label">Now.log · tail -f</span>
			<h1 className="now-top__h1">Now</h1>
			<p className="now-top__deck">What I'm building, learning and exploring at the moment.</p>
			{date && (
				<span className="now-top__updated">last updated · {date}</span>
			)}
		</div>
	);
}

function NowBuildingSection({ currentFocus }) {
	const { building, buildingShort, buildingLink } = currentFocus ?? {};
	return (
		<div className="now-section">
			<span className="now-section__label">building</span>
			<h2 className="now-section__h2">{buildingShort}</h2>
			<p className="now-section__body">{building}</p>
			{buildingLink && (
				<Link to={buildingLink} className="now-section__link">
					Read the case study →
				</Link>
			)}
		</div>
	);
}

function NowLearningSection({ currentFocus }) {
	const { learning, learningShort } = currentFocus ?? {};
	return (
		<div className="now-section">
			<span className="now-section__label">learning</span>
			<h2 className="now-section__h2">{learningShort}</h2>
			<p className="now-section__body">{learning}</p>
		</div>
	);
}

function NowExploringSection({ currentFocus }) {
	const { exploring, exploringShort } = currentFocus ?? {};
	return (
		<div className="now-section now-section--dark">
			<span className="now-section__label now-section__label--duck">exploring</span>
			<h2 className="now-section__h2">{exploringShort}</h2>
			<p className="now-section__body now-section__body--dim">{exploring}</p>
			<Footer />
		</div>
	);
}

// ── Page ──────────────────────────────────────────────────────────

export default function CurrentFocusPage() {
	const { data } = usePortfolioData();
	const { currentFocus } = data;
	const { setQuips } = useQuack();

	useEffect(() => {
		setTimeout(() => setQuips(NOW_QUIPS), 0);
	}, [setQuips]);

	return (
		<>
			<SEOHead
				title="Now"
				description={`A dated snapshot of current focus — ${currentFocus?.date ?? ""}. Building, learning, exploring.`}
			/>

			<StageSection
				id="now-top"
				fn="now()"
				ln="01"
				bg="var(--paper)"
				dark={false}
				scene={<NowTopScene currentFocus={currentFocus} />}
			>
				<NowTopSection currentFocus={currentFocus} />
			</StageSection>

			<StageSection
				id="now-building"
				fn="building()"
				ln="06"
				bg="var(--paper-3)"
				dark={false}
				scene={<NowBuildingScene />}
			>
				<NowBuildingSection currentFocus={currentFocus} />
			</StageSection>

			<StageSection
				id="now-learning"
				fn="learning()"
				ln="12"
				bg="var(--paper)"
				dark={false}
				scene={<NowLearningScene />}
			>
				<NowLearningSection currentFocus={currentFocus} />
			</StageSection>

			<StageSection
				id="now-exploring"
				fn="exploring()"
				ln="18"
				bg="var(--dark-scene)"
				dark={true}
				scene={<NowExploringScene />}
			>
				<NowExploringSection currentFocus={currentFocus} />
			</StageSection>
		</>
	);
}

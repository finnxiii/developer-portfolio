import { useRef } from "react";
import { usePointerParallax } from "../../components/stage/usePointerParallax";
import { useSideArtFit } from "../../hooks/useSideArtFit";
import { useMatchMedia } from "../../hooks/useMatchMedia";
import { useFrontPage } from "./FrontPageContext";

const GT = [
	"ParserTest > handlesEmptyInput()",
	"CartTest > appliesDiscountOnce()",
	"SumToTest > sumsOneToFive()",
	"QueueTest > keepsInsertionOrder()",
];

export default function HeroScene() {
	const { solved, tick, jDone, jTyping, reducedMotion } = useFrontPage();
	const sceneRef = useRef(null);
	usePointerParallax(sceneRef);

	const isMobile = useMatchMedia("(max-width: 1199px)");
	const jshellFits = useSideArtFit(380);
	const gradleFits = useSideArtFit(330);
	const gitlogFits = useSideArtFit(600);

	const gk = Math.floor(tick / 12) % (GT.length + 6);
	const gTests = GT.slice(0, Math.min(gk, GT.length)).map(name => {
		const fail = name.includes("SumTo") && !solved;
		return { name, icon: fail ? "✕" : "✓", col: fail ? "var(--fail)" : "var(--pass)" };
	});

	const displayTests = reducedMotion
		? GT.map(name => ({ name, icon: name.includes("SumTo") && !solved ? "✕" : "✓", col: name.includes("SumTo") && !solved ? "var(--fail)" : "var(--pass)" }))
		: gTests;

	return (
		<div ref={sceneRef} className="hero-scene">
			<pre className="hero-scene__gutter" aria-hidden="true">
				{Array.from({ length: 60 }, (_, i) => i + 1).join("\n")}
			</pre>

			{!isMobile && jshellFits && (
				<div
					className="hero-scene__term hero-scene__term--main"
					style={{ transform: "translate(var(--px,0px), var(--py,0px))" }}
				>
					<div className="term-bar term-bar--dark">
						<i className="term-bar__dot term-bar__dot--red" />
						<i className="term-bar__dot term-bar__dot--yellow" />
						<i className="term-bar__dot term-bar__dot--green" />
						<span>jshell</span>
					</div>
					<div className="hero-scene__jshell-body" aria-hidden="true">
						{jDone.map((s, i) => (
							<div key={i}>
								<div>
									<span className="hero-scene__jshell-prompt">jshell&gt;</span> {s.cmd}
								</div>
								<div className="hero-scene__jshell-out">{s.out}</div>
							</div>
						))}
						{!reducedMotion && (
							<div>
								<span className="hero-scene__jshell-prompt">jshell&gt;</span> {jTyping}
								<span className="hero-scene__cursor" aria-hidden="true">▌</span>
							</div>
						)}
					</div>
				</div>
			)}

			{gradleFits && (
				<div
					className="hero-scene__term hero-scene__term--side hero-scene__term--drift hero-scene__term--gradle"
					aria-hidden="true"
					style={{ transform: "translate(var(--px2,0px), var(--py2,0px))" }}
				>
					<div className="term-bar term-bar--light">
						<i className="term-bar__dot term-bar__dot--muted" />
						<i className="term-bar__dot term-bar__dot--muted" />
						<i className="term-bar__dot term-bar__dot--muted" />
						<span>./gradlew test --continuous</span>
					</div>
					<div className="hero-scene__gradle-body">
						{displayTests.map((g, i) => (
							<div key={i}>
								<span style={{ color: g.col, fontWeight: 600 }}>{g.icon}</span> {g.name}
							</div>
						))}
					</div>
				</div>
			)}

			{gitlogFits && (
				<div
					className="hero-scene__term hero-scene__term--side hero-scene__term--drift hero-scene__term--gitlog"
					aria-hidden="true"
					style={{ transform: "translate(var(--px2,0px), var(--py2,0px))" }}
				>
					<div className="term-bar term-bar--light">
						<i className="term-bar__dot term-bar__dot--muted" />
						<i className="term-bar__dot term-bar__dot--muted" />
						<i className="term-bar__dot term-bar__dot--muted" />
						<span>git log --oneline</span>
					</div>
					<div className="hero-scene__gitlog-body">
						<div><span className="hero-scene__sha">a1f3c9e</span> fix: off-by-one in sumTo</div>
						<div><span className="hero-scene__sha">7be20d4</span> test: cover empty input</div>
						<div><span className="hero-scene__sha">3c9d1aa</span> refactor: name the magic 15</div>
					</div>
				</div>
			)}
		</div>
	);
}

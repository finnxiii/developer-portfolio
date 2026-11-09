import { useEffect, useRef, useState } from "react";
import { useStage } from "../../components/stage/StageContext";
import { usePointerParallax } from "../../components/stage/usePointerParallax";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useSideArtFit } from "../../hooks/useSideArtFit";
import { useFrontPage } from "./FrontPageContext";

function toPascalCase(title) {
	const main = title.split(/\s*[-–]\s*/)[0].trim();
	return main.split(/\s+/).map(w => {
		if (w === w.toUpperCase() && w.length > 1) return w;
		return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
	}).join("");
}

const GT = [
	"ParserTest > handlesEmptyInput()",
	"CartTest > appliesDiscountOnce()",
	"SumToTest > sumsOneToFive()",
	"QueueTest > keepsInsertionOrder()",
];

export default function HeroScene() {
	const { activeId } = useStage();
	const { solved } = useFrontPage();
	const reducedMotion = useReducedMotion();
	const { data } = usePortfolioData();
	const sceneRef = useRef(null);
	usePointerParallax(sceneRef);

	const [tick, setTick] = useState(0);
	const [hidden, setHidden] = useState(false);

	const projectList = (data.projects ?? []).map(p => toPascalCase(p.title));
	const SCRIPT = [
		{ cmd: "var finn = new Developer(\"Finn\");", out: "finn ==> Developer[name=Finn, city=Sheffield]" },
		{ cmd: "finn.likes()", out: "$2 ==> [testing, debugging, systems you can see inside]" },
		{ cmd: "finn.projects()", out: `$3 ==> [${projectList.join(", ")}]` },
		{ cmd: "quack.advice()", out: "$4 ==> \"Explain it to me, line by line.\"" },
	];
	const JCYC = SCRIPT.reduce((a, e) => a + e.cmd.length + 10, 0) + 40;

	const isActive = activeId === "home";
	const jshellFits = useSideArtFit(380);
	const gradleFits = useSideArtFit(330);
	const gitlogFits = useSideArtFit(600);

	useEffect(() => {
		const handler = () => setHidden(document.hidden);
		document.addEventListener("visibilitychange", handler);
		return () => document.removeEventListener("visibilitychange", handler);
	}, []);

	useEffect(() => {
		if (reducedMotion || !isActive || hidden) return;
		const id = setInterval(() => setTick(t => t + 1), 70);
		return () => clearInterval(id);
	}, [reducedMotion, isActive, hidden]);

	let jDone = [], jTyping = "";
	if (reducedMotion) {
		jDone = SCRIPT;
	} else {
		let t = tick % JCYC;
		for (const e of SCRIPT) {
			const L = e.cmd.length + 10;
			if (t >= L) { jDone.push(e); t -= L; }
			else { jTyping = e.cmd.slice(0, Math.min(t, e.cmd.length)); break; }
		}
		jDone = jDone.slice(-3);
	}

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

			{jshellFits && (
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
					<div className="hero-scene__jshell-body">
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

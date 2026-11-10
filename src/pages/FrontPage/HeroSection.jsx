import { useRef, useEffect } from "react";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useFrontPage } from "./FrontPageContext";
import Cmd from "../../components/ui/Cmd/Cmd";

const GT = [
	"ParserTest > handlesEmptyInput()",
	"CartTest > appliesDiscountOnce()",
	"SumToTest > sumsOneToFive()",
	"QueueTest > keepsInsertionOrder()",
];

export default function HeroSection() {
	const { data } = usePortfolioData();
	const { profile } = data;
	const { solved, tick, jDone, jTyping, reducedMotion } = useFrontPage();

	const jshBodyRef = useRef(null);
	useEffect(() => {
		const el = jshBodyRef.current;
		if (el) el.scrollTop = el.scrollHeight;
	}, [jDone.length]);

	// Gradle test state driven by shared tick
	const gk = reducedMotion
		? GT.length
		: Math.floor(tick / 12) % (GT.length + 6);

	const displayTests = reducedMotion
		? GT.map((name) => ({
			name,
			icon: name.includes("SumTo") && !solved ? "✕" : "✓",
			col:  name.includes("SumTo") && !solved ? "var(--fail)" : "var(--pass)",
		}))
		: GT.slice(0, Math.min(gk, GT.length)).map((name) => {
			const fail = name.includes("SumTo") && !solved;
			return { name, icon: fail ? "✕" : "✓", col: fail ? "var(--fail)" : "var(--pass)" };
		});

	return (
		<div className="hero-grid">
			{/* ── Copy ── */}
			<div className="hero-copy">
				<span className="fp-label st" style={{ "--i": 1 }}>
					finnxiii · Sheffield
				</span>
				<h1 className="fp-h1 st" style={{ "--i": 2 }}>
					{profile.heroHeadline}
				</h1>
				<p className="fp-standfirst st" style={{ "--i": 3 }}>
					{profile.heroStandfirst}
				</p>
				<div className="fp-ctas st" style={{ "--i": 4 }}>
					<Cmd glyph="▶" href="#bug">findTheBug()</Cmd>
					<Cmd glyph="$" href="#work">cd caseStudies/</Cmd>
					<Cmd glyph="↗" href={profile.links.cv} variant="ghost" target="_blank" rel="noopener noreferrer">open cv.pdf</Cmd>
				</div>
			</div>

			{/* ── Art: three tilted windows ── */}
			<div className="hero-art">
				{/* git log */}
				<div
					className="hero-win hero-win--git st"
					style={{ "--i": 5 }}
					aria-hidden="true"
				>
					<div className="term-bar term-bar--light">
						<i className="term-bar__dot term-bar__dot--muted" />
						<i className="term-bar__dot term-bar__dot--muted" />
						<i className="term-bar__dot term-bar__dot--muted" />
						<span>git log --oneline</span>
					</div>
					<div className="hero-win__body hero-win__body--light">
						<div><span className="hero-win__sha">a1f3c9e</span> fix: off-by-one in sumTo</div>
						<div><span className="hero-win__sha">7be20d4</span> test: cover empty input</div>
						<div className="hero-win__git-line3">
							<span className="hero-win__sha">3c9d1aa</span> refactor: name the magic 15
						</div>
					</div>
				</div>

				{/* jshell */}
				<div
					className="hero-win hero-win--jsh st"
					style={{ "--i": 6 }}
					role="img"
					aria-label="jshell session introducing Finn"
				>
					<div className="term-bar term-bar--dark">
						<i className="term-bar__dot term-bar__dot--red" />
						<i className="term-bar__dot term-bar__dot--yellow" />
						<i className="term-bar__dot term-bar__dot--green" />
						<span>jshell</span>
					</div>
					<div className="hero-win__body hero-win__body--jsh" ref={jshBodyRef}>
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

				{/* gradle */}
				<div
					className="hero-win hero-win--gradle st"
					style={{ "--i": 7 }}
					aria-hidden="true"
				>
					<div className="term-bar term-bar--light">
						<i className="term-bar__dot term-bar__dot--muted" />
						<i className="term-bar__dot term-bar__dot--muted" />
						<i className="term-bar__dot term-bar__dot--muted" />
						<span>./gradlew test --continuous</span>
					</div>
					<div className="hero-win__body hero-win__body--light">
						{displayTests.map((g, i) => (
							<div key={i}>
								<span style={{ color: g.col, fontWeight: 600 }}>{g.icon}</span>{" "}
								{g.name}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

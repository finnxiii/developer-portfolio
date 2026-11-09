import { useEffect, useRef, useState } from "react";
import { useStage } from "../../components/stage/StageContext";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import Footer from "../../components/layout/Footer/Footer";

function deriveTestName(principle) {
	let s = principle.replace(/\.$/, "").replace(/all of /g, "");
	const words = s.split(/[\s,–-]+/).filter(Boolean);
	if (!words.length) return "";
	const firstWord = words[0].toLowerCase() + "s";
	const rest = words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
	return firstWord + rest.join("");
}

function getReference(projectLink, projects) {
	const workMatch = projectLink?.match(/^\/work\/([^/]+)$/);
	const noteMatch = projectLink?.match(/^\/notes\/([^/]+)$/);
	if (workMatch) {
		const p = projects.find(pr => pr.slug === workMatch[1]);
		return p ? p.title.split(/\s*[-–]\s*/)[0].trim() : workMatch[1];
	}
	if (noteMatch) return "this site";
	return "";
}

export default function TestsSection() {
	const { activeId } = useStage();
	const { data } = usePortfolioData();
	const reducedMotion = useReducedMotion();
	const [runKey, setRunKey] = useState(0);
	const prevActive = useRef(false);

	useEffect(() => {
		const isActive = activeId === "tests";
		if (isActive && !prevActive.current) {
			const t = setTimeout(() => setRunKey(k => k + 1), 0);
			prevActive.current = isActive;
			return () => clearTimeout(t);
		}
		prevActive.current = isActive;
	}, [activeId]);

	const philosophy = data.philosophy ?? [];
	const projects = data.projects ?? [];
	const animName = runKey % 2 === 0 ? "revA" : "revB";

	return (
		<div className="tests-section">
			<div className="tests-section__header">
				<h2 className="fp-h2 fp-h2--dark">How I work</h2>
				<button
					type="button"
					onClick={() => setRunKey(k => k + 1)}
					className="tests-section__rerun"
				>
					▶ Run tests again
				</button>
			</div>
			<div className="tests-code">
				<div className="tests-code__line tests-code__line--muted">$ ./gradlew test</div>
				<div className="tests-code__line">
					FinnTest{" "}
					<span className="tests-code__annotation">
						@DisplayName(<span className="tests-code__string">&quot;How Finn works&quot;</span>)
					</span>
				</div>
				{philosophy.map((item, i) => {
					const name = item.testName || deriveTestName(item.principle);
					const ref = getReference(item.projectLink, projects);
					const delay = reducedMotion ? 0 : 0.5 + i * 0.35;
					return (
						<div
							key={`${runKey}-${i}`}
							className="tests-code__test"
							style={reducedMotion ? {} : {
								animation: `${animName} 350ms ease-out ${delay}s both`,
							}}
						>
							<span className="tests-code__pass">✓</span>{" "}
							{name}(){" "}
							<span className="tests-code__comment">// {ref}</span>
						</div>
					);
				})}
				<div
					key={`pass-${runKey}`}
					className="tests-code__success"
					style={reducedMotion ? {} : {
						animation: `${animName} 350ms ease-out 2.4s both`,
					}}
				>
					BUILD SUCCESSFUL · {philosophy.length} tests passed{" "}
					<span className="tests-code__cursor" aria-hidden="true">▌</span>
				</div>
			</div>
			<Footer />
		</div>
	);
}

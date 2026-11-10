import { createContext, useCallback, useContext, useState, useEffect, useMemo } from "react";
import { useStage } from "../../components/stage/StageContext";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { usePortfolioData } from "../../hooks/usePortfolioData";

function toPascalCase(title) {
	const main = title.split(/\s*[-–]\s*/)[0].trim();
	return main.split(/\s+/).map(w => {
		if (w === w.toUpperCase() && w.length > 1) return w;
		return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
	}).join("");
}

const FrontPageCtx = createContext(null);

export function FrontPageProvider({ children }) {
	const [solved, setSolved] = useState(() => {
		try { return sessionStorage.getItem("bug-solved") === "1"; } catch { return false; }
	});

	const solve = useCallback(() => {
		setSolved(true);
		try { sessionStorage.setItem("bug-solved", "1"); } catch { /* unavailable */ }
	}, []);

	const resetBug = useCallback(() => {
		setSolved(false);
		try { sessionStorage.removeItem("bug-solved"); } catch { /* unavailable */ }
	}, []);

	// Jshell typing state — shared between HeroScene (≥1200px) and HeroSection (< 1200px)
	const { activeId } = useStage();
	const reducedMotion = useReducedMotion();
	const { data } = usePortfolioData();
	const [tick, setTick] = useState(0);
	const [hidden, setHidden] = useState(false);

	const projectList = useMemo(
		() => (data.projects ?? []).map(p => toPascalCase(p.title)),
		[data.projects]
	);

	const SCRIPT = useMemo(() => [
		{ cmd: "var finn = new Developer(\"Finn\");", out: "finn ==> Developer[name=Finn, city=Sheffield]" },
		{ cmd: "finn.likes()", out: "$2 ==> [testing, debugging, systems you can see inside]" },
		{ cmd: "finn.projects()", out: `$3 ==> [${projectList.join(", ")}]` },
		{ cmd: "quack.advice()", out: "$4 ==> \"Explain it to me, line by line.\"" },
	], [projectList]);

	const JCYC = useMemo(() => SCRIPT.reduce((a, e) => a + e.cmd.length + 10, 0) + 40, [SCRIPT]);

	useEffect(() => {
		const handler = () => setHidden(document.hidden);
		document.addEventListener("visibilitychange", handler);
		return () => document.removeEventListener("visibilitychange", handler);
	}, []);

	const isActive = activeId === "home";
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
		// All lines are kept; fixed-height body handles visual overflow via scroll
	}

	return (
		<FrontPageCtx.Provider value={{ solved, solve, resetBug, tick, jDone, jTyping, reducedMotion }}>
			{children}
		</FrontPageCtx.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFrontPage() {
	const ctx = useContext(FrontPageCtx);
	if (!ctx) throw new Error("useFrontPage must be inside FrontPageProvider");
	return ctx;
}

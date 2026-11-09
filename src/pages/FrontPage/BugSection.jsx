import { useState } from "react";
import { useFrontPage } from "./FrontPageContext";
import { useQuack } from "../../components/quack/QuackContext";

const BUG_LINE = 3;
const LINES = [
	"int sumTo(int n) {",
	"  int total = 0;",
	"  for (int i = 1; i < n; i++) {",
	"    total += i;",
	"  }",
	"  return total;",
	"}",
];
const FIXED_LINE = "  for (int i = 1; i <= n; i++) {";
const TRACE = [
	{ ln: 2, i: "–", t: 0 }, { ln: 3, i: 1, t: 0 }, { ln: 4, i: 1, t: 1 },
	{ ln: 4, i: 2, t: 3 },   { ln: 4, i: 3, t: 6 }, { ln: 4, i: 4, t: 10 },
	{ ln: 3, i: 5, t: 10 },  { ln: 6, i: 5, t: 10 },
];

export default function BugSection() {
	const { solved, solve, resetBug } = useFrontPage();
	const { say } = useQuack();
	const [wrong, setWrong] = useState([]);
	const [stepN, setStepN] = useState(0);

	const cur = stepN > 0 ? TRACE[Math.min(stepN, TRACE.length) - 1] : null;

	const pickLine = (n) => {
		if (solved) return;
		if (n === BUG_LINE) {
			solve();
			say("Quack!! You found it. Off-by-one.");
		} else if (!wrong.includes(n)) {
			setWrong(w => [...w, n]);
		}
	};

	const step = () => setStepN(s => s >= TRACE.length ? 1 : s + 1);

	const reset = () => {
		setWrong([]);
		setStepN(0);
		resetBug();
	};

	const getHint = () => {
		if (solved) return "Fixed! The loop stopped before i reached n, so 5 was never added. < becomes <=. The test on the first screen is green now too.";
		if (cur && cur.ln === 3 && cur.i === 5) return "i is 5 and the loop condition says stop. Should it?";
		if (wrong.length >= 2) return "Hint: 10 is 1+2+3+4. Which number is missing?";
		return "The test expects sumTo(5) to be 15, but it got 10. Step through and watch total.";
	};

	const stepLabel = cur ? `paused at line ${cur.ln}` : "click a line, or Step";
	const testResult = solved
		? { bg: "var(--pass-bg)", fg: "#1C4A2A", icon: "✓", msg: "expected 15, got 15" }
		: { bg: "var(--fail-bg)", fg: "#7A2414", icon: "✕", msg: "expected 15, got 10" };

	return (
		<div className="bug-section">
			<div className="bug-section__header">
				<h2 className="fp-h2">Find the bug</h2>
				<span className="fp-label">level 1 · off-by-one</span>
			</div>
			<p className="bug-section__intro">
				A test is failing. Click the line you think is wrong, or step through it like a debugger.
			</p>
			<div className="bug-section__game">
				<div className="bug-panel">
					<div className="bug-panel__header">
						<span>SumTo.java</span>
						<span>{stepLabel}</span>
					</div>
					<div className="bug-panel__code">
						{LINES.map((lineCode, idx) => {
							const n = idx + 1;
							const isSolved = solved && n === BUG_LINE;
							const isWrong = wrong.includes(n);
							const isCurrent = cur && cur.ln === n;
							const code = isSolved ? FIXED_LINE : lineCode;
							const bg = isSolved ? "var(--pass-bg)" : isWrong ? "var(--fail-bg)" : isCurrent ? "#FFF4CC" : "transparent";
							const shadow = isSolved ? "inset 4px 0 0 var(--pass)" : isWrong ? "inset 4px 0 0 var(--fail)" : "none";
							const mark = isSolved ? "fixed: < → <=" : isWrong ? "not this one" : "";
							const markCol = isSolved ? "var(--pass)" : "var(--fail)";
							return (
								<button
									key={n}
									type="button"
									onClick={() => pickLine(n)}
									aria-label={`Line ${n}: ${code}`}
									className="bug-panel__line"
									style={{ background: bg, boxShadow: shadow }}
								>
									<span className="bug-panel__arrow">{isCurrent ? "▶" : ""}</span>
									<span className="bug-panel__linenum">{n}</span>
									<span className="bug-panel__code-text">{code}</span>
									{mark && <span className="bug-panel__mark" style={{ color: markCol }}>{mark}</span>}
								</button>
							);
						})}
					</div>
					<div className="bug-panel__test" style={{ background: testResult.bg, color: testResult.fg }}>
						<span className="bug-panel__test-name">
							<strong>{testResult.icon} SumToTest.sumsOneToFive</strong>
						</span>
						<span>{testResult.msg}</span>
					</div>
				</div>

				<div className="bug-sidebar">
					<div className="bug-vars">
						<span className="bug-vars__label">variables</span>
						<span>n = 5</span>
						<span>i = <strong>{cur ? cur.i : "–"}</strong></span>
						<span>total = <strong>{cur ? cur.t : "–"}</strong></span>
					</div>
					<div className="bug-controls">
						<button type="button" onClick={step} className="bug-btn bug-btn--solid">
							Step ▸
						</button>
						<button type="button" onClick={reset} className="bug-btn bug-btn--outline">
							Reset
						</button>
					</div>
					<p className="bug-hint" aria-live="polite">{getHint()}</p>
				</div>
			</div>
		</div>
	);
}

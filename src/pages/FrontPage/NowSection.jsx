import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useStage } from "../../components/stage/StageContext";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useReducedMotion } from "../../hooks/useReducedMotion";

function formatUptime(since) {
	const [y, m] = since.split("-").map(Number);
	const start = new Date(y, m - 1, 1);
	const now = new Date();
	let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
	const years = Math.floor(months / 12);
	months = months % 12;
	if (years > 0 && months > 0) return `${years}y ${months}m`;
	if (years > 0) return `${years}y`;
	return `${months}m`;
}

function sparkPoints(data, w = 200, h = 44) {
	const n = data.length;
	return data.map((v, i) => {
		const x = Math.round((i / (n - 1)) * w);
		const y = +(h - (v / 100) * (h * 0.75) - h * 0.1).toFixed(1);
		return `${x},${y}`;
	}).join(" ");
}

const PROC_BASE = [72, 58, 12];
const PROC_VAR = [12, 16, 8];
const COUNT = 10;

function initData(reduced) {
	if (reduced) return PROC_BASE.map(b => Array(COUNT).fill(b));
	return PROC_BASE.map((base, ci) =>
		Array.from({ length: COUNT }, () =>
			Math.max(5, Math.min(95, base + (Math.random() - 0.5) * PROC_VAR[ci] * 2))
		)
	);
}

function formatDate(iso) {
	if (!iso) return "";
	const d = new Date(iso + "T12:00:00");
	return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(d);
}

export default function NowSection() {
	const { data } = usePortfolioData();
	const { currentFocus = {}, fieldNotes = [] } = data;
	const { activeId } = useStage();
	const reduced = useReducedMotion();
	const sectionActive = activeId === "now";

	const [tabHidden, setTabHidden] = useState(false);
	useEffect(() => {
		const h = () => setTabHidden(document.hidden);
		document.addEventListener("visibilitychange", h);
		return () => document.removeEventListener("visibilitychange", h);
	}, []);

	const [sparkData, setSparkData] = useState(() => initData(reduced));

	useEffect(() => {
		if (reduced || !sectionActive || tabHidden) return;
		const id = setInterval(() => {
			setSparkData((prev) =>
				prev.map((arr, ci) => {
					const last = arr[arr.length - 1];
					const next = Math.max(5, Math.min(95, last + (Math.random() - 0.5) * PROC_VAR[ci]));
					return [...arr.slice(1), Math.round(next)];
				})
			);
		}, 800);
		return () => clearInterval(id);
	}, [reduced, sectionActive, tabHidden]);

	const uptime = formatUptime("2024-09");
	const recentNotes = fieldNotes.slice(0, 3);
	const NOTE_TILTS = ["-1.4deg", "0.9deg", "-0.6deg"];

	const procs = useMemo(() => [
		{
			pid: "1337",
			state: "running",
			kind: "building",
			title: currentFocus.buildingShort ?? "Building",
			text: currentFocus.building ?? "",
			link: currentFocus.buildingLink ?? null,
			color: "var(--lane-degree)",
			strokeColor: "#3F6FB0",
		},
		{
			pid: "2048",
			state: "running",
			kind: "learning",
			title: currentFocus.learningShort ?? "Learning",
			text: currentFocus.learning ?? "",
			link: null,
			color: "var(--lane-project)",
			strokeColor: "#B06C12",
		},
		{
			pid: "3141",
			state: "sleeping",
			kind: "exploring",
			title: currentFocus.exploringShort ?? "Exploring",
			text: currentFocus.exploring ?? "",
			link: null,
			color: "var(--lane-work)",
			strokeColor: "#3E8456",
		},
	], [currentFocus]);

	return (
		<div className="now-section">
			<div className="now-section__header">
				<h2 className="fp-h2">Now</h2>
				<span className="fp-label now-section__uptime">
					$ top -u finn · up {uptime}
				</span>
			</div>

			<div className="now-procs">
				{procs.map((proc, ci) => {
					const pts = sparkPoints(sparkData[ci]);
					const cpu = sparkData[ci][sparkData[ci].length - 1];
					return (
						<div key={proc.kind} className="proc" style={{ "--proc-c": proc.color }}>
							<div className="proc__top">
								<span className="proc__pid fp-label">PID {proc.pid}</span>
								<span className="proc__state" style={{ color: proc.color }}>● {proc.state}</span>
							</div>
							<span className="proc__kind fp-label">{proc.kind}</span>
							<span className="proc__title">{proc.title}</span>
							<p className="proc__text">{proc.text}</p>
							{!reduced && (
								<svg className="proc__spark" viewBox="0 0 200 44" preserveAspectRatio="none" aria-hidden="true">
									<polyline points={pts} fill="none" stroke={proc.strokeColor} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
								</svg>
							)}
							<div className="proc__foot">
								<span className="fp-label">CPU {cpu}%</span>
								{proc.link
									? <Link to={proc.link} className="proc__foot-link fp-label">{proc.link}</Link>
									: <span className="fp-label proc__foot-label">--</span>
								}
							</div>
						</div>
					);
				})}
			</div>

			{recentNotes.length > 0 && (
				<div className="now-writes">
					<div className="now-writes__header">
						<span className="fp-label">
							$ ls -lt notes/ | head -3{" "}
							<span className="now-writes__comment"># recently written</span>
						</span>
						<Link to="/notes" className="now-writes__all fp-label">
							all {fieldNotes.length} field notes →
						</Link>
					</div>
					<div className="now-nshelf">
						{recentNotes.map((note, i) => (
							<Link
								key={note.slug}
								to={`/notes/${note.slug}`}
								className="ncard"
								style={{ "--ncard-r": NOTE_TILTS[i] ?? "0deg" }}
							>
								<div className="term-bar term-bar--light">
									<span className="term-bar__dot term-bar__dot--muted" />
									<span className="term-bar__dot term-bar__dot--muted" />
									<span className="term-bar__dot term-bar__dot--muted" />
									<span className="ncard__file">{note.slug}.md</span>
								</div>
								<div className="ncard__body">
									<span className="ncard__meta fp-label">
										{note.topic} · {note.readTime}
									</span>
									<span className="ncard__title">
										<span className="ncard__hash fp-label"># </span>
										{note.title}
									</span>
									{note.deck && (
										<span className="ncard__deck fp-label">&gt; {note.deck}</span>
									)}
								</div>
								<div className="ncard__foot fp-label">
									<span>{formatDate(note.date)}</span>
									<span>open →</span>
								</div>
							</Link>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

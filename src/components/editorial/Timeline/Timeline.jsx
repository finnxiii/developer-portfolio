import { useState, useEffect } from "react";
import "./Timeline.scss";

// ── Date parsing ───────────────────────────────────────────────────────

const MONTH_MAP = {
	jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
	jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

function parseMonthYear(str) {
	const s = (str || "").toLowerCase().trim();
	if (s === "present") return new Date();
	const m = s.match(/([a-z]+)\s+(\d{4})/);
	if (!m) return null;
	const month = MONTH_MAP[m[1].slice(0, 3)];
	if (month === undefined) return null;
	return new Date(parseInt(m[2]), month, 1);
}

function parseRange(dateRange) {
	const parts = dateRange.split(/\s*[—–]\s*|\s+-\s+/);
	const start = parseMonthYear(parts[0]) || new Date();
	const endStr = (parts[1] || "").trim();
	const isCurrent = !endStr || endStr.toLowerCase() === "present";
	const end = isCurrent ? new Date() : parseMonthYear(endStr) || new Date();
	return { start, end, isCurrent };
}

function monthDiff(a, b) {
	return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
}

function toPct(date, rangeStart, totalMonths) {
	const diff = monthDiff(rangeStart, date);
	return Math.min(100, Math.max(0, (diff / totalMonths) * 100));
}

const ROW_H = 56;

// ── Mobile vertical list ───────────────────────────────────────────────

function MobileTimeline({ items }) {
	return (
		<div className="tl-mobile">
			<div className="tl-mobile__line" aria-hidden="true" />
			{items.map((item, i) => (
				<div
					key={i}
					className={`tl-mobile__entry${item.isCurrent ? " tl-mobile__entry--current" : ""}`}
				>
					<div
						className={`tl-mobile__dot${item.isCurrent ? " tl-mobile__dot--current" : ""}`}
						aria-hidden="true"
					/>
					<span className="tl-mobile__date label-text">{item.dateRange}</span>
					<p className="tl-mobile__org">{item.org}</p>
					<em className="tl-mobile__role">{item.role}</em>
					{item.bullets?.length > 0 && (
						<ul className="tl-mobile__bullets" role="list">
							{item.bullets.map((b, j) => (
								<li key={j} className="tl-mobile__bullet">{b}</li>
							))}
						</ul>
					)}
				</div>
			))}
		</div>
	);
}

// ── Main component ─────────────────────────────────────────────────────

export default function Timeline({ experience = [] }) {
	const [isMobile, setIsMobile] = useState(
		() => typeof window !== "undefined" && !window.matchMedia("(min-width: 768px)").matches
	);

	useEffect(() => {
		const mq = window.matchMedia("(min-width: 768px)");
		const handler = (e) => setIsMobile(!e.matches);
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);

	const now = new Date();

	const parsed = experience
		.map((e) => ({ ...e, ...parseRange(e.dateRange) }))
		.sort((a, b) => b.start - a.start);

	const defaultIdx = Math.max(parsed.findIndex((e) => e.isCurrent), 0);
	const [selectedIdx, setSelectedIdx] = useState(defaultIdx);

	const allStarts = parsed.map((e) => e.start.getTime());
	const minDate = new Date(Math.min(...allStarts, now.getTime()));
	const rangeStart = new Date(minDate.getFullYear(), minDate.getMonth() - 1, 1);
	// domain ends at current month + 2 for breathing room around NOW line
	const rangeEnd = new Date(now.getFullYear(), now.getMonth() + 2, 1);
	const totalMonths = Math.max(monthDiff(rangeStart, rangeEnd), 1);
	const nowPct = toPct(now, rangeStart, totalMonths);

	const firstYear = rangeStart.getFullYear();
	const numRoles = parsed.length;

	const yearMarks = [];
	for (let y = rangeStart.getFullYear(); y <= rangeEnd.getFullYear(); y++) {
		const d = new Date(y, 0, 1);
		if (d > rangeStart && d < rangeEnd) {
			yearMarks.push({ year: y, pct: toPct(d, rangeStart, totalMonths) });
		}
	}

	const quarterTicks = [];
	let qd = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), 1);
	while (qd < rangeEnd) {
		if (qd.getMonth() % 3 === 0 && qd.getMonth() !== 0 && qd > rangeStart) {
			quarterTicks.push(toPct(qd, rangeStart, totalMonths));
		}
		qd = new Date(qd.getFullYear(), qd.getMonth() + 1, 1);
	}

	const selected = parsed[selectedIdx] ?? null;

	if (isMobile) {
		return (
			<section className="tl" aria-label="Experience timeline">
				<div className="container">
					<div className="tl__header rv">
						<h2 className="tl__heading">Experience</h2>
						<span className="tl__meta label-text">{numRoles} roles · {firstYear}–Now</span>
					</div>
					<MobileTimeline items={parsed} />
				</div>
			</section>
		);
	}

	return (
		<section className="tl" aria-label="Experience timeline">
			<div className="container">

				<div className="tl__header rv">
					<h2 className="tl__heading">Experience</h2>
					<span className="tl__meta label-text">{numRoles} roles · {firstYear}–Now</span>
				</div>

				<div className="tl__chart-wrap rv" data-reveal-delay="0.05">

					{/* NOW overlay — pointer-events:none, spans rows area */}
					<div
						className="tl__now-overlay"
						style={{ left: `${nowPct}%`, height: numRoles * ROW_H }}
						aria-hidden="true"
					>
						<span className="tl__now-label">NOW</span>
						<div className="tl__now-line" />
					</div>

					{/* Rows */}
					<div className="tl__rows-area">
						{parsed.map((item, i) => {
							const startPct = toPct(item.start, rangeStart, totalMonths);
							const endPct = item.isCurrent
								? nowPct
								: toPct(item.end, rangeStart, totalMonths);
							const barW = endPct - startPct;
							// right-align label if bar starts in right 35% of chart
							const labelOnRight = startPct > 50;
							const isSelected = selectedIdx === i;

							// maxWidth constrains the label to the remaining horizontal space
							// so the label's own text-overflow:ellipsis fires instead of a
							// hard clip from the parent's overflow:hidden.
							const labelStyle = labelOnRight
								? {
										right: `${(100 - endPct).toFixed(3)}%`,
										left: "auto",
										maxWidth: `${endPct.toFixed(3)}%`,
									}
								: {
										left: `${startPct.toFixed(3)}%`,
										right: "auto",
										maxWidth: `${(100 - startPct).toFixed(3)}%`,
									};

							return (
								<button
									key={i}
									type="button"
									className={`tl__row${isSelected ? " tl__row--active" : " tl__row--dim"}`}
									onClick={() => setSelectedIdx(i)}
									aria-pressed={isSelected}
									aria-label={`${item.org} — ${item.role}`}
								>
									<span
										className={`tl__row-label${isSelected ? " tl__row-label--active" : ""}`}
										style={labelStyle}
									>
										<span className="tl__row-org">{item.org}</span>
										<span className="tl__row-sep"> · </span>
										<span className="tl__row-role">{item.role}</span>
									</span>
									<span
										className={`tl__bar${item.isCurrent ? " tl__bar--current" : ""}${isSelected ? " tl__bar--active" : ""}`}
										style={{ left: `${startPct.toFixed(3)}%`, width: `max(10px, ${barW.toFixed(3)}%)` }}
									/>
								</button>
							);
						})}
					</div>

					{/* Axis */}
					<div className="tl__axis-area">
						{yearMarks.map(({ year, pct }) => (
							<span key={`tick-${year}`} className="tl__year-tick" style={{ left: `${pct}%` }} aria-hidden="true" />
						))}
						{quarterTicks.map((pct, i) => (
							<span key={i} className="tl__quarter-tick" style={{ left: `${pct}%` }} aria-hidden="true" />
						))}
						{yearMarks.map(({ year, pct }) => (
							<span key={year} className="tl__year-label" style={{ left: `${pct}%` }}>
								{year}
							</span>
						))}
					</div>
				</div>

				{/* Detail panel */}
				{selected && (
					<div className="tl__detail" key={selectedIdx}>
						<div className="tl__detail-left">
							<span className="tl__detail-date label-text">{selected.dateRange}</span>
							{selected.isCurrent && (
								<span className="tl__detail-current label-text">Current</span>
							)}
						</div>
						<div className="tl__detail-right">
							<p className="tl__detail-org">{selected.org}</p>
							<em className="tl__detail-role">{selected.role}</em>
							{selected.bullets?.length > 0 && (
								<ul className="tl__detail-bullets" role="list">
									{selected.bullets.map((b, j) => (
										<li key={j} className="tl__detail-bullet">{b}</li>
									))}
								</ul>
							)}
						</div>
					</div>
				)}
			</div>
		</section>
	);
}

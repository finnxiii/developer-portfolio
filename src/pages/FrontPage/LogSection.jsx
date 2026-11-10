import { useState } from "react";
import { usePortfolioData } from "../../hooks/usePortfolioData";

const LANE_COLOR = {
	degree: "var(--lane-degree)",
	projects: "var(--lane-project)",
	work: "var(--lane-work)",
};

const MONTH_MAP = {
	Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
	Jul: 7, Aug: 8, Sep: 9, Sept: 9, Oct: 10, Nov: 11, Dec: 12,
};

function parseDateStart(dateRange) {
	const match = dateRange.match(/([A-Za-z]+)\s+(\d{4})/);
	if (!match) return null;
	const m = MONTH_MAP[match[1]];
	if (!m) return null;
	return `${match[2]}-${String(m).padStart(2, "0")}`;
}

function formatDate(dateStr) {
	const [year, month] = dateStr.split("-");
	const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	return `${months[parseInt(month, 10) - 1]} ${year}`;
}

export default function LogSection() {
	const { data } = usePortfolioData();
	const timeline = data.timeline ?? [];
	const experience = data.experience ?? [];

	const entries = timeline.map((entry) => {
		const match = experience.find((exp) => parseDateStart(exp.dateRange) === entry.date);
		return { ...entry, match: match ?? null };
	});

	const firstExpandable = entries.findIndex((e) => e.match !== null);
	const [openIdx, setOpenIdx] = useState(firstExpandable);

	function toggle(i) {
		setOpenIdx((prev) => (prev === i ? -1 : i));
	}

	return (
		<div className="log-section">
			<div className="log-section__header">
				<h2 className="fp-h2">
					git log <span className="log-section__cmd">--graph --life</span>
				</h2>
				<span className="log-section__legend fp-label">
					<span style={{ color: "var(--lane-degree)" }}>● degree</span>
					<span style={{ color: "var(--lane-project)" }}>● projects</span>
					<span style={{ color: "var(--lane-work)" }}>● work</span>
				</span>
			</div>

			<div className="log-section__list" role="list">
				{entries.map((entry, i) => {
					const col = LANE_COLOR[entry.lane] ?? "var(--muted)";
					const isOpen = openIdx === i;
					const hasMatch = entry.match !== null;
					const typeStr = entry.lane === "degree"
						? `${entry.type}:`
						: `${entry.type}(${entry.lane}):`;

					return (
						<div
							key={i}
							role="listitem"
							className={"log-entry" + (isOpen ? " log-entry--open" : "")}
						>
							{hasMatch ? (
								<button
									type="button"
									className="log-row"
									onClick={() => toggle(i)}
									aria-expanded={isOpen}
								>
									<span className="log-row__dot" style={{ background: col }} aria-hidden="true" />
									<span className="log-row__msg">
										<span className="log-row__type" style={{ color: col }}>{typeStr}</span>
										{" "}
										<span className="log-row__text">{entry.message}</span>
									</span>
									<span className="log-row__date">{formatDate(entry.date)}</span>
									<span className="log-row__arrow" aria-hidden="true" style={{ color: "var(--amber)" }}>
										{isOpen ? "↓" : "›"}
									</span>
								</button>
							) : (
								<div className="log-row log-row--static">
									<span className="log-row__dot" style={{ background: col }} aria-hidden="true" />
									<span className="log-row__msg">
										<span className="log-row__type" style={{ color: col }}>{typeStr}</span>
										{" "}
										<span className="log-row__text">{entry.message}</span>
									</span>
									<span className="log-row__date">{formatDate(entry.date)}</span>
									<span className="log-row__arrow" aria-hidden="true" />
								</div>
							)}

							{hasMatch && (
								<div className={"log-bullets-wrap" + (isOpen ? " log-bullets-wrap--open" : "")}>
									<div className="log-bullets-inner">
										<ul className="log-bullets">
											{(entry.match.bullets ?? []).map((b, j) => (
												<li key={j}>{b}</li>
											))}
										</ul>
									</div>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

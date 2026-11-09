import { useEffect, useRef, useState } from "react";
import { useStage } from "../../components/stage/StageContext";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const LANE_COLOR = {
	degree: "var(--lane-degree)",
	projects: "var(--lane-project)",
	work: "var(--lane-work)",
};

function formatDate(dateStr) {
	const [year, month] = dateStr.split("-");
	const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	return `${months[parseInt(month, 10) - 1]} ${year}`;
}

function formatType(type, lane) {
	if (lane === "degree") return `${type}:`;
	return `${type}(${lane}):`;
}

export default function LogSection() {
	const { activeId } = useStage();
	const { data } = usePortfolioData();
	const reducedMotion = useReducedMotion();
	const [runKey, setRunKey] = useState(0);
	const prevActive = useRef(false);

	useEffect(() => {
		const isActive = activeId === "log";
		if (isActive && !prevActive.current) {
			const t = setTimeout(() => setRunKey(k => k + 1), 0);
			prevActive.current = isActive;
			return () => clearTimeout(t);
		}
		prevActive.current = isActive;
	}, [activeId]);

	const timeline = data.timeline ?? [];
	const animName = runKey % 2 === 0 ? "revA" : "revB";

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
				{timeline.map((entry, i) => {
					const col = LANE_COLOR[entry.lane] ?? "var(--muted)";
					const typeStr = formatType(entry.type, entry.lane);
					const delay = reducedMotion ? 0 : 0.5 + i * 0.08;
					return (
						<div
							key={`${runKey}-${i}`}
							role="listitem"
							className="log-row"
							style={reducedMotion ? {} : {
								animation: `${animName} 350ms ease-out ${delay}s both`,
							}}
						>
							<span className="log-row__dot" style={{ background: col }} aria-hidden="true" />
							<span className="log-row__text">
								<span className="log-row__type" style={{ color: col }}>{typeStr}</span>{" "}
								{entry.message}
							</span>
							<span className="log-row__date">{formatDate(entry.date)}</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}

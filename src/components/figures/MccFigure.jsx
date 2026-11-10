import { useReducedMotion } from "../../hooks/useReducedMotion";

export default function MccFigure() {
	const reduced = useReducedMotion();
	const dash = reduced ? undefined : "6 6";
	const anim = reduced ? "none" : "dash 0.9s linear infinite";

	const boxes = [
		{ x: 20,  label: "upload.csv" },
		{ x: 180, label: "parse & validate" },
		{ x: 340, label: "diff preview" },
		{ x: 500, label: "confirm()" },
		{ x: 660, label: "save()" },
	];
	const hl = 2;

	return (
		<svg
			viewBox="0 0 760 160"
			className="arch-svg"
			role="img"
			aria-label="Meeting Cost Calculator: CSV upload, parse, diff preview, confirm and save"
			style={{ width: "100%", height: "auto", display: "block" }}
		>
			{boxes.map((b, i) => (
				<g key={i}>
					<rect
						x={b.x} y="40" width="120" height="56" rx="10"
						fill={i === hl ? "#FFF4CC" : "#FFFFFF"}
						stroke={i === hl ? "#C27A1E" : "#CFC8BB"}
						strokeWidth="1.5"
					/>
					<text
						x={b.x + 60} y="72"
						textAnchor="middle"
						fontFamily="IBM Plex Mono, monospace"
						fontSize="12"
						fill="#4A463F"
					>
						{b.label}
					</text>
				</g>
			))}
			{boxes.slice(0, -1).map((b, i) => (
				<line
					key={i}
					x1={b.x + 120} y1="68"
					x2={boxes[i + 1].x} y2="68"
					stroke="#C27A1E"
					strokeWidth="2"
					strokeDasharray={dash}
					style={{ animation: anim }}
				/>
			))}
			<text x="20" y="145" fontFamily="IBM Plex Mono, monospace" fontSize="12" fill="#8A847A">
				fig. 1 — the diff step shows changes before anything is written
			</text>
		</svg>
	);
}

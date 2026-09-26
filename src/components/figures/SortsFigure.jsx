const CX = 200;
const CY = 200;
const R = 115;
const R0 = R * Math.SQRT2 / 2; // ≈ 81.3, ring midpoint radius component

// Station boxes: centered at cardinal points on the ring
const STATIONS = [
	{ id: "cam",  cx: CX,     cy: CY - R, w: 110, h: 40, lines: ["ESP32-CAM", "CAPTURE"] },
	{ id: "py",   cx: CX + R, cy: CY,     w: 100, h: 40, lines: ["PYTHON", "PIPELINE"] },
	{ id: "gem",  cx: CX,     cy: CY + R, w: 100, h: 40, lines: ["GEMINI", "CLASSIFY"] },
	{ id: "ard",  cx: CX - R, cy: CY,     w: 112, h: 40, lines: ["ARDUINO R4", "→ SERVO"] },
];

// Arrow marks at midpoints between stations (NE, SE, SW, NW of ring)
// angle = SVG rotation matching clockwise travel direction
const RING_ARROWS = [
	{ x: CX + R0, y: CY - R0, angle: 45  }, // between top and right
	{ x: CX + R0, y: CY + R0, angle: 135 }, // between right and bottom
	{ x: CX - R0, y: CY + R0, angle: 225 }, // between bottom and left
	{ x: CX - R0, y: CY - R0, angle: 315 }, // between left and top
];

function StationBox({ cx, cy, w, h, lines }) {
	const x = cx - w / 2;
	const y = cy - h / 2;
	return (
		<g>
			<rect
				x={x} y={y} width={w} height={h}
				fill="var(--surface)"
				stroke="var(--ink)"
				strokeWidth="1"
				rx="1"
			/>
			<text
				x={cx}
				y={cy - 6}
				textAnchor="middle"
				fontFamily="var(--font-mono)"
				fontSize="9"
				fill="var(--ink)"
				letterSpacing="0.07em"
			>
				<tspan x={cx} dy="0">{lines[0]}</tspan>
				<tspan x={cx} dy="12">{lines[1]}</tspan>
			</text>
		</g>
	);
}

export default function SortsFigure() {
	return (
		<svg
			className="sorts-figure"
			viewBox="0 0 400 400"
			width="100%"
			role="img"
			aria-label="The SORTS loop: four stations around a ring — ESP32-CAM capture, Python pipeline, Gemini classify, Arduino R4 servo actuation — completed in six hours. Awarded Most Adventurous Hack at iForge Hack Day 2025."
		>
			<defs>
				<marker
					id="sorts-arr"
					markerWidth="7" markerHeight="6"
					refX="6" refY="3"
					orient="auto"
					markerUnits="userSpaceOnUse"
				>
					<path d="M0,0 L6,3 L0,6 Z" fill="var(--ink-secondary)" />
				</marker>
			</defs>

			{/* Ring */}
			<circle
				cx={CX} cy={CY} r={R}
				fill="none"
				stroke="var(--rule)"
				strokeWidth="1.5"
			/>

			{/* Directional arrow marks on the ring at midpoints */}
			{RING_ARROWS.map((a, i) => (
				<polygon
					key={i}
					points="-7,-4 7,0 -7,4"
					transform={`translate(${a.x.toFixed(1)},${a.y.toFixed(1)}) rotate(${a.angle})`}
					fill="var(--ink-secondary)"
				/>
			))}

			{/* Station boxes — drawn on top of ring so they break the circle visually */}
			{STATIONS.map((s) => (
				<StationBox key={s.id} {...s} />
			))}

			{/* Centre: time and award label */}
			<text
				x={CX} y={CY - 12}
				textAnchor="middle"
				dominantBaseline="auto"
				fontFamily="var(--font-serif)"
				fontSize="30"
				fontWeight="700"
				fill="var(--accent)"
			>
				6 hrs
			</text>
			<text
				x={CX} y={CY + 14}
				textAnchor="middle"
				fontFamily="var(--font-mono)"
				fontSize="8.5"
				fill="var(--ink-tertiary)"
				letterSpacing="0.1em"
			>
				MOST ADVENTUROUS HACK
			</text>
		</svg>
	);
}

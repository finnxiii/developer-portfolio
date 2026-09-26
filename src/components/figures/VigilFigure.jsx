// Shared SVG primitives
function Box({ x, y, w, h = 32, label, label2, dashed = false, dim = false }) {
	const stroke = dim ? "var(--ink-tertiary)" : "var(--ink)";
	const fill = "var(--surface)";
	const textFill = dim ? "var(--ink-tertiary)" : "var(--ink)";
	const cx = x + w / 2;
	const cy = y + h / 2;
	return (
		<g>
			<rect
				x={x} y={y} width={w} height={h}
				fill={fill}
				stroke={stroke}
				strokeWidth="1"
				strokeDasharray={dashed ? "4 3" : undefined}
				rx="1"
			/>
			{label2 ? (
				<text
					x={cx} y={cy - 6}
					textAnchor="middle"
					fontFamily="var(--font-mono)"
					fontSize="9"
					fill={textFill}
					letterSpacing="0.07em"
				>
					<tspan x={cx} dy="0">{label}</tspan>
					<tspan x={cx} dy="12">{label2}</tspan>
				</text>
			) : (
				<text
					x={cx} y={cy}
					textAnchor="middle"
					dominantBaseline="middle"
					fontFamily="var(--font-mono)"
					fontSize="9"
					fill={textFill}
					letterSpacing="0.07em"
				>
					{label}
				</text>
			)}
		</g>
	);
}

function Arrow({ d, dashed = false, dim = false, markerId }) {
	const stroke = dim ? "var(--ink-tertiary)" : "var(--ink-secondary)";
	return (
		<path
			d={d}
			fill="none"
			stroke={stroke}
			strokeWidth="1"
			strokeDasharray={dashed ? "4 3" : undefined}
			markerEnd={`url(#${markerId})`}
		/>
	);
}

// ── Horizontal layout (≥ 640 px) ────────────────────────────────
// viewBox 0 0 720 210
// Main row y=90 h=32; branch row y=156 h=32; live tail y=14 h=32; ghost y=155 h=44
function HorizontalDiagram() {
	return (
		<svg
			className="vigil-figure__h"
			viewBox="0 0 720 210"
			width="100%"
			role="img"
			aria-label="Vigil request path: JS snippet sends a POST to /collect; each request is enriched with GeoIP data, scored 0–100 for bot likelihood, and stored in a TimescaleDB hypertable. Hourly continuous aggregates feed the dashboard; a WebSocket live-tail streams events in real time. A Redis Streams worker is planned between intake and enrichment."
		>
			<defs>
				{/* Solid arrowhead */}
				<marker id="vh-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="userSpaceOnUse">
					<path d="M0,0 L5,3 L0,6 Z" fill="var(--ink-secondary)" />
				</marker>
				{/* Dim dashed arrowhead */}
				<marker id="vh-arr-dim" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="userSpaceOnUse">
					<path d="M0,0 L5,3 L0,6 Z" fill="var(--ink-tertiary)" />
				</marker>
			</defs>

			{/* ── Main flow boxes ── */}
			<Box x={8}   y={90} w={84}  label="JS SNIPPET" />
			<Box x={112} y={90} w={102} label="POST /COLLECT" />
			<Box x={234} y={90} w={102} label="ENRICH (GEOIP)" />
			<Box x={356} y={90} w={92}  label="SCORE (0–100)" />
			<Box x={468} y={90} w={158} label="TIMESCALEDB HYPERTABLE" />

			{/* ── Branch boxes ── */}
			<Box x={468} y={156} w={128} label="HOURLY AGGREGATE" />
			<Box x={608} y={156} w={90}  label="DASHBOARD" />

			{/* ── Live tail (dashed, above /collect) ── */}
			<Box x={88}  y={14}  w={140} label="LIVE TAIL (WEBSOCKET)" dashed />

			{/* ── Ghost: Redis Streams worker (planned) ── */}
			<Box x={148} y={155} w={168} h={44} label="REDIS STREAMS WORKER" label2="(PLANNED)" dashed dim />

			{/* ── Solid arrows: main flow ── */}
			<Arrow d="M92,106 L112,106"     markerId="vh-arr" />
			<Arrow d="M214,106 L234,106"    markerId="vh-arr" />
			<Arrow d="M336,106 L356,106"    markerId="vh-arr" />
			<Arrow d="M448,106 L468,106"    markerId="vh-arr" />
			{/* B5 → B6 elbow */}
			<Arrow d="M547,122 L547,140 L532,140 L532,156" markerId="vh-arr" />
			{/* B6 → B7 */}
			<Arrow d="M596,172 L608,172" markerId="vh-arr" />

			{/* ── Dashed arrow: /collect → live tail (upward) ── */}
			<Arrow d="M163,90 L163,46" dashed markerId="vh-arr" />

			{/* ── Dashed arrows: planned Redis Streams path ── */}
			<Arrow d="M163,122 L163,139 L175,139 L175,155" dashed dim markerId="vh-arr-dim" />
			<Arrow d="M293,155 L293,139 L285,139 L285,122" dashed dim markerId="vh-arr-dim" />
		</svg>
	);
}

// ── Vertical layout (< 640 px) ───────────────────────────────────
// viewBox 0 0 300 460
// Main vertical stack; Live tail branches right of /collect; ghost box between /collect and Enrich
function VerticalDiagram() {
	return (
		<svg
			className="vigil-figure__v"
			viewBox="0 0 300 460"
			width="100%"
			role="img"
			aria-label="Vigil request path (vertical): JS snippet, POST /collect, Enrich (GeoIP), Score (0–100), TimescaleDB hypertable, Hourly aggregate, Dashboard. Live tail branches from /collect. Redis Streams worker is planned between /collect and Enrich."
		>
			<defs>
				<marker id="vv-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="userSpaceOnUse">
					<path d="M0,0 L5,3 L0,6 Z" fill="var(--ink-secondary)" />
				</marker>
				<marker id="vv-arr-dim" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="userSpaceOnUse">
					<path d="M0,0 L5,3 L0,6 Z" fill="var(--ink-tertiary)" />
				</marker>
			</defs>

			{/* Main stack */}
			<Box x={75} y={14}  w={150} h={32} label="JS SNIPPET" />
			<Box x={75} y={72}  w={150} h={32} label="POST /COLLECT" />

			{/* Ghost: Redis Streams (planned), between /collect and Enrich */}
			<Box x={65} y={136} w={170} h={44} label="REDIS STREAMS WORKER" label2="(PLANNED)" dashed dim />

			<Box x={75} y={202} w={150} h={32} label="ENRICH (GEOIP)" />
			<Box x={75} y={258} w={150} h={32} label="SCORE (0–100)" />
			<Box x={58} y={314} w={184} h={32} label="TIMESCALEDB HYPERTABLE" />

			{/* Branch row */}
			<Box x={58}  y={380} w={130} h={32} label="HOURLY AGGREGATE" />
			<Box x={205} y={380} w={90}  h={32} label="DASHBOARD" />

			{/* Live tail — right of /collect */}
			<Box x={238} y={72} w={58} h={32} label="LIVE TAIL" label2="(WS)" dashed />

			{/* Solid arrows: main flow */}
			<Arrow d="M150,46 L150,72"           markerId="vv-arr" />
			<Arrow d="M150,246 L150,258"          markerId="vv-arr" />
			<Arrow d="M150,290 L150,314"          markerId="vv-arr" />
			<Arrow d="M150,346 L150,365 L123,365 L123,380" markerId="vv-arr" />
			<Arrow d="M188,396 L205,396"          markerId="vv-arr" />

			{/* Dashed: /collect → ghost, ghost → Enrich */}
			<Arrow d="M150,104 L150,136"  dashed dim markerId="vv-arr-dim" />
			<Arrow d="M150,180 L150,202"  dashed dim markerId="vv-arr-dim" />

			{/* Dashed: /collect → live tail */}
			<Arrow d="M225,88 L238,88" dashed markerId="vv-arr" />
		</svg>
	);
}

export default function VigilFigure() {
	return (
		<>
			<HorizontalDiagram />
			<VerticalDiagram />
		</>
	);
}

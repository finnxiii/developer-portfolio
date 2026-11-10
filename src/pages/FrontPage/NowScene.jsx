export default function NowScene() {
	return (
		<div className="now-scene">
			<svg
				className="now-scene__arcs"
				viewBox="0 0 400 400"
				aria-hidden="true"
				fill="none"
			>
				{/* Guide circles (faint) */}
				<circle cx="320" cy="300" r="80"  stroke="rgba(36,34,31,.06)" strokeWidth="2" />
				<circle cx="320" cy="300" r="140" stroke="rgba(36,34,31,.04)" strokeWidth="2" />
				<circle cx="320" cy="300" r="200" stroke="rgba(36,34,31,.03)" strokeWidth="2" />

				{/* Rotating arcs */}
				<circle
					cx="320" cy="300" r="80"
					stroke="var(--lane-degree)"
					strokeOpacity=".5"
					strokeWidth="3"
					strokeDasharray="90 420"
					strokeLinecap="round"
					style={{ transformOrigin: "320px 300px", animation: "nowArcA 12s linear infinite" }}
				/>
				<circle
					cx="320" cy="300" r="140"
					stroke="var(--lane-project)"
					strokeOpacity=".45"
					strokeWidth="3"
					strokeDasharray="130 749"
					strokeLinecap="round"
					style={{ transformOrigin: "320px 300px", animation: "nowArcB 20s linear infinite" }}
				/>
				<circle
					cx="320" cy="300" r="200"
					stroke="var(--lane-work)"
					strokeOpacity=".35"
					strokeWidth="3"
					strokeDasharray="160 1097"
					strokeLinecap="round"
					style={{ transformOrigin: "320px 300px", animation: "nowArcC 30s linear infinite reverse" }}
				/>
			</svg>
		</div>
	);
}

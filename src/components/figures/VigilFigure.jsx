import { useReducedMotion } from "../../hooks/useReducedMotion";

export default function VigilFigure() {
	const reduced = useReducedMotion();
	const dash = reduced ? undefined : "6 6";
	const anim = reduced ? "none" : "dash 0.9s linear infinite";

	return (
		<svg
			viewBox="0 0 760 300"
			className="arch-svg"
			role="img"
			aria-label="Vigil: request path from snippet through enrichment to dashboard"
			style={{ width: "100%", height: "auto", display: "block" }}
		>
			{/* Row 1 */}
			<rect x="20" y="40" width="210" height="60" rx="10" fill="#FFFFFF" stroke="#CFC8BB" strokeWidth="1.5"/>
			<text x="125" y="76" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="15" fill="#4A463F">&lt;script&gt; snippet</text>
			<rect x="270" y="40" width="210" height="60" rx="10" fill="#FFFFFF" stroke="#CFC8BB" strokeWidth="1.5"/>
			<text x="375" y="76" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="15" fill="#4A463F">POST /collect</text>
			<rect x="520" y="40" width="210" height="60" rx="10" fill="#FFFFFF" stroke="#CFC8BB" strokeWidth="1.5"/>
			<text x="625" y="76" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="15" fill="#4A463F">GeoLite2 enrich</text>

			{/* Row 2 (highlighted: bot score) */}
			<rect x="520" y="190" width="210" height="60" rx="10" fill="#FFF4CC" stroke="#C27A1E" strokeWidth="1.5"/>
			<text x="625" y="226" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="15" fill="#4A463F">bot score 0–100</text>
			<rect x="270" y="190" width="210" height="60" rx="10" fill="#FFFFFF" stroke="#CFC8BB" strokeWidth="1.5"/>
			<text x="375" y="226" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="15" fill="#4A463F">TimescaleDB</text>
			<rect x="20" y="190" width="210" height="60" rx="10" fill="#FFFFFF" stroke="#CFC8BB" strokeWidth="1.5"/>
			<text x="125" y="226" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="15" fill="#4A463F">dashboard · live</text>

			{/* Connectors */}
			<line x1="230" y1="70" x2="270" y2="70" stroke="#C27A1E" strokeWidth="2" strokeDasharray={dash} style={{ animation: anim }}/>
			<line x1="480" y1="70" x2="520" y2="70" stroke="#C27A1E" strokeWidth="2" strokeDasharray={dash} style={{ animation: anim }}/>
			<line x1="625" y1="100" x2="625" y2="190" stroke="#C27A1E" strokeWidth="2" strokeDasharray={dash} style={{ animation: anim }}/>
			<line x1="520" y1="220" x2="480" y2="220" stroke="#C27A1E" strokeWidth="2" strokeDasharray={dash} style={{ animation: anim }}/>
			<line x1="270" y1="220" x2="230" y2="220" stroke="#C27A1E" strokeWidth="2" strokeDasharray={dash} style={{ animation: anim }}/>

			<text x="20" y="288" fontFamily="IBM Plex Mono, monospace" fontSize="12" fill="#8A847A">fig. 1 — intake, enrichment and scoring happen before storage</text>
		</svg>
	);
}

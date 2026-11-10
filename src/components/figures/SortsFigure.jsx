import { useReducedMotion } from "../../hooks/useReducedMotion";

export default function SortsFigure() {
	const reduced = useReducedMotion();
	const dash = reduced ? undefined : "6 6";
	const anim = reduced ? "none" : "dash 0.9s linear infinite";

	return (
		<svg
			viewBox="0 0 760 240"
			className="arch-svg"
			role="img"
			aria-label="SORTS: camera captures, vision model classifies, servo actuates, loops"
			style={{ width: "100%", height: "auto", display: "block" }}
		>
			<rect x="40" y="60" width="180" height="64" rx="10" fill="#FFFFFF" stroke="#CFC8BB" strokeWidth="1.5"/>
			<text x="130" y="96" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="15" fill="#4A463F">camera.capture()</text>

			<rect x="290" y="60" width="180" height="64" rx="10" fill="#FFF4CC" stroke="#C27A1E" strokeWidth="1.5"/>
			<text x="380" y="96" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="15" fill="#4A463F">vision.classify()</text>

			<rect x="540" y="60" width="180" height="64" rx="10" fill="#FFFFFF" stroke="#CFC8BB" strokeWidth="1.5"/>
			<text x="630" y="96" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="15" fill="#4A463F">servo.actuate()</text>

			<line x1="220" y1="92" x2="290" y2="92" stroke="#C27A1E" strokeWidth="2" strokeDasharray={dash} style={{ animation: anim }}/>
			<line x1="470" y1="92" x2="540" y2="92" stroke="#C27A1E" strokeWidth="2" strokeDasharray={dash} style={{ animation: anim }}/>

			<path
				d="M 720 124 C 720 180, 40 180, 40 124"
				fill="none"
				stroke="#C27A1E"
				strokeWidth="2"
				strokeDasharray={dash}
				style={{ animation: anim }}
			/>
			<polygon points="40,114 34,128 46,128" fill="#C27A1E"/>

			<text x="20" y="220" fontFamily="IBM Plex Mono, monospace" fontSize="12" fill="#8A847A">
				fig. 1 — capture, classify and actuate run in a continuous loop
			</text>
		</svg>
	);
}

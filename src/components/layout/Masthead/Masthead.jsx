import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { usePortfolioData } from "../../../hooks/usePortfolioData";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import "./Masthead.scss";

gsap.registerPlugin(SplitText);

function firstSentence(text = "") {
	const m = text.match(/^[^.!?]+[.!?]/);
	return m ? m[0] : text.slice(0, 120);
}

export default function Masthead() {
	const mastheadRef = useRef(null);
	const prefersReduced = useReducedMotion();

	const { data } = usePortfolioData();
	const { currentFocus } = data;

	useGSAP(
		() => {
			if (prefersReduced) return;
			const scope = mastheadRef.current;
			if (!scope) return;

			const wm = scope.querySelector(".masthead__wordmark");
			const leftEar = scope.querySelector(".masthead__ear--left");
			const rightEar = scope.querySelector(".masthead__ear--right");
			const rule = scope.querySelector(".masthead__rule");

			if (!wm) return;

			let split;
			try {
				split = new SplitText(wm, { type: "chars", mask: "chars" });
			} catch {
				return;
			}
			// Pad masks to prevent clipping of ascenders and descenders
			gsap.set(split.masks, {
				paddingTop: "0.05em",
				marginTop: "-0.05em",
				paddingBottom: "0.18em",
				marginBottom: "-0.18em",
			});

			const tl = gsap.timeline();

			tl.from(split.chars, {
				yPercent: 100,
				stagger: 0.03,
				duration: 0.9,
				ease: "expo.out",
			});

			if (leftEar) {
				tl.from(
					leftEar,
					{ opacity: 0, duration: 0.4, ease: "power2.out" },
					"-=0.4"
				);
			}
			if (rightEar) {
				tl.from(
					rightEar,
					{ opacity: 0, duration: 0.4, ease: "power2.out" },
					"<"
				);
			}
			if (rule) {
				tl.from(
					rule,
					{ scaleX: 0, transformOrigin: "left center", duration: 0.8, ease: "power3.inOut" },
					"-=0.2"
				);
			}

			return () => split.revert();
		},
		{ scope: mastheadRef, dependencies: [prefersReduced] }
	);

	return (
		<header className="masthead" role="banner" ref={mastheadRef}>
			<div className="masthead__body container">
				<div className="masthead__grid">

					{/* Left ear */}
					<aside className="masthead__ear masthead__ear--left" aria-label="Edition subtitle">
						<p className="masthead__ear-label">THE ENGINEERING EDITION</p>
						<p className="masthead__ear-sub">
							<em>Software, systems and field notes by Naing Htoo Lwin.</em>
						</p>
					</aside>

					{/* Centre wordmark */}
					<div className="masthead__centre">
						<Link to="/" className="masthead__wordmark" aria-label="FINNXIII.DEV — Home">
							FINNXIII.DEV
						</Link>
					</div>

					{/* Right ear */}
					{currentFocus && (
						<aside className="masthead__ear masthead__ear--right" aria-label="Current focus">
							<div className="masthead__ear-now-row">
								<span className="masthead__ear-dot" aria-hidden="true" />
								<span className="masthead__ear-now-label">NOW BUILDING</span>
							</div>
							<p className="masthead__ear-building">
								{firstSentence(currentFocus.building)}
							</p>
						</aside>
					)}

				</div>
			</div>
			<div className="masthead__rule" aria-hidden="true" />
		</header>
	);
}

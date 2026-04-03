import { useRef } from "react";
import { usePathDraw } from "../hooks/usePathDraw";
import { hero, heroPathSequence, heroTextSequence } from "../data/siteData";
import "./Hero.css";

export default function Hero() {
	const svgRef = useRef(null);
	usePathDraw(svgRef, heroPathSequence, heroTextSequence);

	return (
		<section id="hero" className="hero">
			{/* centred SVG drawing — FINN only, no decorative shapes */}
			<div className="hero__svg-wrap">
				<svg
					ref={svgRef}
					className="hero__svg"
					viewBox="0 0 520 160"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					aria-label="Finn"
				>
					{/* F — pink */}
					<path id="p-F1" d="M 16 12 L 16 148" stroke="var(--c-pink)" strokeWidth="16" strokeLinecap="round" />
					<path id="p-F2" d="M 16 12 L 116 12" stroke="var(--c-pink)" strokeWidth="16" strokeLinecap="round" />
					<path id="p-F3" d="M 16 80 L 90 80" stroke="var(--c-pink)" strokeWidth="16" strokeLinecap="round" />

					{/* I — blue */}
					<path id="p-I1" d="M 176 12 L 176 148" stroke="var(--c-green)" strokeWidth="16" strokeLinecap="round" />

					{/* N — green */}
					<path id="p-N1a" d="M 216 148 L 216 12" stroke="var(--c-blue)" strokeWidth="16" strokeLinecap="round" />
					<path id="p-N1b" d="M 216 12  L 336 148" stroke="var(--c-blue)" strokeWidth="16" strokeLinecap="round" />
					<path id="p-N1c" d="M 336 12  L 336 148" stroke="var(--c-blue)" strokeWidth="16" strokeLinecap="round" />

					{/* N — blue */}
					<path id="p-N2a" d="M 376 148 L 376 12" stroke="var(--c-blue)" strokeWidth="16" strokeLinecap="round" />
					<path id="p-N2b" d="M 376 12  L 496 148" stroke="var(--c-blue)" strokeWidth="16" strokeLinecap="round" />
					<path id="p-N2c" d="M 496 12  L 496 148" stroke="var(--c-blue)" strokeWidth="16" strokeLinecap="round" />
				</svg>
			</div>

			{/* text below the drawing */}
			<div className="hero__text">
				<p id="ht-role" className="hero__role">
					{hero.role}
				</p>
			</div>

			<div className="hero__scroll-hint" aria-hidden="true">
				<span className="hero__scroll-label">Scroll</span>
				<span className="hero__scroll-line" />
			</div>
		</section>
	);
}

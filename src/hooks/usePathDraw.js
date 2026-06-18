import { useEffect, useRef } from "react";
import gsap from "gsap";

export function usePathDraw(svgRef, sequence, textItems = []) {
	const tlRef = useRef(null);

	useEffect(() => {
		const svg = svgRef.current;
		if (!svg) return;

		const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		// Set initial hidden state
		sequence.forEach(({ id }) => {
			const el = svg.querySelector(`#${id}`);
			if (!el) return;
			const len = el.getTotalLength?.() ?? 300;
			gsap.set(el, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });
		});

		textItems.forEach(({ id }) => {
			const el = document.getElementById(id);
			if (!el) return;
			gsap.set(el, { opacity: 0, y: 10 });
		});

		if (prefersReduced) {
			sequence.forEach(({ id }) => {
				const el = svg.querySelector(`#${id}`);
				if (el) gsap.set(el, { strokeDashoffset: 0, opacity: 1 });
			});
			textItems.forEach(({ id }) => {
				const el = document.getElementById(id);
				if (el) gsap.set(el, { opacity: 1, y: 0 });
			});
			return;
		}

		const tl = gsap.timeline();
		tlRef.current = tl;

		// Animate each path at its absolute delay offset
		sequence.forEach(({ id, delay, dur }) => {
			const el = svg.querySelector(`#${id}`);
			if (!el) return;
			tl.to(el, { strokeDashoffset: 0, opacity: 1, duration: dur / 1000, ease: "power3.out" }, delay / 1000);
		});

		// Animate text items
		textItems.forEach(({ id, delay, dur }) => {
			const el = document.getElementById(id);
			if (!el) return;
			tl.to(el, { opacity: 1, y: 0, duration: dur / 1000, ease: "power3.out" }, delay / 1000);
		});

		return () => {
			tl.kill();
		};
	}, [svgRef, sequence, textItems]);
}

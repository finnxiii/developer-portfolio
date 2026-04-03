import { useEffect, useRef } from "react";

/**
 * Animates SVG path/shape elements by drawing them sequentially
 * using strokeDashoffset.
 *
 * @param {React.RefObject}  svgRef      — ref to the <svg> element
 * @param {Array}            sequence    — from heroPathSequence in siteData
 * @param {Array}            textItems   — from heroTextSequence in siteData
 */
export function usePathDraw(svgRef, sequence, textItems = []) {
	const timers = useRef([]);

	useEffect(() => {
		const svg = svgRef.current;
		if (!svg) return;

		// -- hide all paths immediately
		sequence.forEach(({ id }) => {
			const el = svg.querySelector(`#${id}`);
			if (!el) return;
			const len = el.getTotalLength?.() ?? 300;
			Object.assign(el.style, {
				strokeDasharray: len,
				strokeDashoffset: len,
				opacity: "0",
				transition: "none",
			});
		});

		// -- hide text elements
		textItems.forEach(({ id }) => {
			const el = document.getElementById(id);
			if (!el) return;
			Object.assign(el.style, {
				opacity: "0",
				transform: "translateY(10px)",
				transition: "none",
			});
		});

		// force reflow so transition:none is committed
		svg.getBoundingClientRect();

		// -- animate paths
		sequence.forEach(({ id, delay, dur }) => {
			const t = setTimeout(() => {
				const el = svg.querySelector(`#${id}`);
				if (!el) return;
				el.style.opacity = "1";
				el.style.transition = `stroke-dashoffset ${dur}ms cubic-bezier(.22,1,.36,1)`;
				el.style.strokeDashoffset = "0";
			}, delay);
			timers.current.push(t);
		});

		// -- animate text
		textItems.forEach(({ id, delay, dur }) => {
			const t = setTimeout(() => {
				const el = document.getElementById(id);
				if (!el) return;
				el.style.transition = `opacity ${dur}ms cubic-bezier(.22,1,.36,1), transform ${dur}ms cubic-bezier(.22,1,.36,1)`;
				el.style.opacity = "1";
				el.style.transform = "translateY(0)";
			}, delay);
			timers.current.push(t);
		});

		return () => timers.current.forEach(clearTimeout);
	}, [svgRef, sequence, textItems]);
}

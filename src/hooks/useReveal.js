import { useEffect, useRef } from "react";

/**
 * Attaches a bidirectional IntersectionObserver to all `.rv` elements
 * inside the given container (defaults to document).
 *
 * Elements animate in when entering the viewport and animate back out
 * when leaving — up or down — by toggling .in / .out-up / .out-down.
 */
export function useReveal(containerRef = null) {
	const observedRef = useRef(new Map());

	useEffect(() => {
		const root = containerRef?.current ?? null;
		const elements = (root ?? document).querySelectorAll(".rv");

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const el = entry.target;
					const prev = observedRef.current.get(el);

					if (entry.isIntersecting) {
						el.classList.remove("out-up", "out-down");
						el.classList.add("in");
						observedRef.current.set(el, { top: entry.boundingClientRect.top, visible: true });
					} else if (prev) {
						const goingUp = entry.boundingClientRect.top > prev.top;
						el.classList.remove("in");
						el.classList.add(goingUp ? "out-down" : "out-up");
						observedRef.current.set(el, { top: entry.boundingClientRect.top, visible: false });
					}
				});
			},
			{ root, threshold: 0.12, rootMargin: "0px 0px -16px 0px" },
		);

		elements.forEach((el) => {
			observer.observe(el);
			observedRef.current.set(el, { top: 0, visible: false });
		});

		return () => observer.disconnect();
	}, [containerRef]);
}

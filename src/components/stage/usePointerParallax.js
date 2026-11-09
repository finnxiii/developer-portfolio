import { useEffect, useRef } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export function usePointerParallax(elRef) {
	const rafRef = useRef(null);
	const prefersReduced = useReducedMotion();

	useEffect(() => {
		const el = elRef?.current;
		if (!el || prefersReduced) return;

		// Disable on touch / hover-none devices
		if (window.matchMedia("(hover: none)").matches) return;

		const onMove = (e) => {
			if (rafRef.current) return;
			rafRef.current = requestAnimationFrame(() => {
				rafRef.current = null;
				const vw = window.innerWidth;
				const vh = window.innerHeight;
				const dx = (0.5 - e.clientX / vw);
				const dy = (0.5 - e.clientY / vh);
				el.style.setProperty("--px", `${(dx * 18).toFixed(1)}px`);
				el.style.setProperty("--py", `${(dy * 12).toFixed(1)}px`);
				el.style.setProperty("--px2", `${(dx * 32).toFixed(1)}px`);
				el.style.setProperty("--py2", `${(dy * 22).toFixed(1)}px`);
			});
		};

		window.addEventListener("pointermove", onMove, { passive: true });
		return () => {
			window.removeEventListener("pointermove", onMove);
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, [elRef, prefersReduced]);
}

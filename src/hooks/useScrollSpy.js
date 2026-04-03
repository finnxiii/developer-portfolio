import { useState, useEffect, useRef } from "react";
import { sections } from "../data/siteData";

/**
 * Watches which section is currently in view.
 * Returns { activeIndex } where 0 = hero, 1 = about, etc.
 */
export function useScrollSpy() {
	const [activeIndex, setActiveIndex] = useState(0);
	const rafRef = useRef(null);

	useEffect(() => {
		const onScroll = () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
			rafRef.current = requestAnimationFrame(() => {
				let current = 0;
				sections.forEach((id, i) => {
					const el = document.getElementById(id);
					if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.45) {
						current = i;
					}
				});
				setActiveIndex(current);
			});
		};

		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", onScroll);
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, []);

	return { activeIndex };
}

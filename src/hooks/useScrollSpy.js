import { useState, useEffect, useRef } from "react";
import { SECTIONS } from "../constants";

export function useScrollSpy() {
	const [activeIndex, setActiveIndex] = useState(0);
	const rafRef = useRef(null);

	useEffect(() => {
		const onScroll = () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
			rafRef.current = requestAnimationFrame(() => {
				let current = 0;
				SECTIONS.forEach((id, i) => {
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

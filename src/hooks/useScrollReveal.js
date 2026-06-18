import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal(containerRef) {
	useEffect(() => {
		const container = containerRef?.current ?? document;
		const elements = Array.from(container.querySelectorAll(".rv"));
		if (!elements.length) return;

		const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		if (prefersReduced) {
			elements.forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
			return;
		}

		const triggers = [];

		elements.forEach((el) => {
			const delay = parseFloat(el.dataset.revealDelay || "0");
			gsap.set(el, { opacity: 0, y: 40 });

			const st = ScrollTrigger.create({
				trigger: el,
				start: "top 88%",
				onEnter: () => {
					gsap.to(el, {
						opacity: 1,
						y: 0,
						duration: 0.8,
						delay,
						ease: "power3.out",
						overwrite: "auto",
					});
				},
				onLeaveBack: () => {
					gsap.set(el, { opacity: 0, y: 40 });
				},
			});

			triggers.push(st);
		});

		return () => triggers.forEach((t) => t.kill());
	}, [containerRef]);
}

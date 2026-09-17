import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal(containerRef) {
	const prefersReduced = useReducedMotion();

	useGSAP(
		() => {
			const scope = containerRef?.current;
			const elements = gsap.utils.toArray(".rv", scope);
			if (!elements.length) return;

			if (prefersReduced) {
				gsap.set(elements, { opacity: 1, y: 0 });
				return;
			}

			elements.forEach((el) => {
				const delay = parseFloat(el.dataset.revealDelay || "0");
				gsap.set(el, { opacity: 0, y: 12 });

				ScrollTrigger.create({
					trigger: el,
					start: "top 88%",
					once: true,
					onEnter: () => {
						gsap.to(el, {
							opacity: 1,
							y: 0,
							duration: 0.5,
							delay,
							ease: "power2.out",
						});
					},
				});
			});
		},
		{ scope: containerRef, dependencies: [prefersReduced] }
	);
}

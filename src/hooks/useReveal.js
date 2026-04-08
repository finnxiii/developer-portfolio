import { useEffect } from "react";

export function useReveal() {
	useEffect(() => {
		const elements = document.querySelectorAll(".rv");

		elements.forEach((el) => {
			el.style.opacity = "0";
			el.style.transform = "translateY(40px)";
			el.style.transition = "none";
			el.style.willChange = "opacity, transform";
		});

		document.body.getBoundingClientRect();

		elements.forEach((el) => {
			el.style.transition =
				"opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)";
		});

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const el = entry.target;
					const delay = parseFloat(el.dataset.revealDelay || "0");

					if (entry.isIntersecting) {
						// entering from bottom — animate in
						setTimeout(() => {
							el.style.opacity = "1";
							el.style.transform = "translateY(0)";
						}, delay * 1000);
					} else {
						// only reset if element is BELOW the viewport (scrolled back up)
						// not when it exits from the top
						const rect = entry.boundingClientRect;
						if (rect.top > 0) {
							// element is below viewport — reset so it can animate in again
							el.style.transition = "none";
							el.style.opacity = "0";
							el.style.transform = "translateY(40px)";
							requestAnimationFrame(() => {
								requestAnimationFrame(() => {
									el.style.transition =
										"opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)";
								});
							});
						}
						// if rect.top < 0 — element left from top, keep it visible
					}
				});
			},
			{ threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
		);

		elements.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	}, []);
}

import { useEffect, useState } from "react";
import { useStage } from "../components/stage/StageContext";

export function useSideArtFit(neededWidth) {
	const { activeId } = useStage();
	const [fits, setFits] = useState(false);

	useEffect(() => {
		function measure() {
			if (!activeId) { setFits(false); return; }
			const section = document.querySelector(`.stage-section[data-scene="${activeId}"]`);
			if (!section) { setFits(false); return; }

			// Measure right edge of actual text elements, not the container
			const textEls = section.querySelectorAll(
				".stage-section__inner h1, .stage-section__inner h2, " +
				".stage-section__inner h3, .stage-section__inner p, " +
				".stage-section__inner ul"
			);
			let maxRight = 0;
			for (const el of textEls) {
				const r = el.getBoundingClientRect().right;
				if (r > maxRight) maxRight = r;
			}

			// Fallback: use first child of .stage-section__inner
			if (!maxRight) {
				const inner = section.querySelector(".stage-section__inner");
				const child = inner?.firstElementChild;
				maxRight = child
					? child.getBoundingClientRect().right
					: inner?.getBoundingClientRect().right ?? 0;
			}

			setFits(maxRight > 0 && window.innerWidth - maxRight >= neededWidth + 48);
		}

		measure();
		document.fonts.ready.then(measure);
		window.addEventListener("resize", measure, { passive: true });
		return () => window.removeEventListener("resize", measure);
	}, [activeId, neededWidth]);

	return fits;
}

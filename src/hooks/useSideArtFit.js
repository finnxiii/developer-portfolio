import { useEffect, useState } from "react";
import { useStage } from "../components/stage/StageContext";

export function useSideArtFit(neededWidth) {
	const { activeId } = useStage();
	const [fits, setFits] = useState(false);

	useEffect(() => {
		function measure() {
			const sel = activeId
				? `[data-scene="${activeId}"] .inner`
				: ".stage-section .inner";
			const inner = document.querySelector(sel);
			if (inner) {
				const { right } = inner.getBoundingClientRect();
				setFits(window.innerWidth - right >= neededWidth + 48);
			} else {
				setFits(false);
			}
		}

		measure();
		window.addEventListener("resize", measure, { passive: true });
		return () => window.removeEventListener("resize", measure);
	}, [activeId, neededWidth]);

	return fits;
}

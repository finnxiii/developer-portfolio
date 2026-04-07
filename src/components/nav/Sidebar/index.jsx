import { useRef, useEffect, useState } from "react";
import { useScrollSpy } from "../../../hooks/useScrollSpy";
import { SECTIONS } from "../../../constants";
import "./Sidebar.scss";

export default function Sidebar() {
	const { activeIndex } = useScrollSpy();
	const prevIndex = useRef(activeIndex);
	const [leavingIndex, setLeavingIndex] = useState(-1);

	useEffect(() => {
		if (prevIndex.current !== activeIndex) {
			setLeavingIndex(prevIndex.current);
			prevIndex.current = activeIndex;
			const t = setTimeout(() => setLeavingIndex(-1), 400);
			return () => clearTimeout(t);
		}
	}, [activeIndex]);

	return (
		<nav className="sidebar" aria-label="Page sections">
			<div className="sidebar__track">
				{SECTIONS.map((_, i) => {
					const isActive = i === activeIndex;
					const isDone = i < activeIndex;
					const isLeaving = i === leavingIndex;
					const isEntering = isActive && leavingIndex !== -1;

					const dotClass = [
						"sidebar__dot",
						isDone ? "done" : "",
						isActive ? "active" : "",
						isLeaving ? "leaving" : "",
						isEntering ? "entering" : "",
					]
						.filter(Boolean)
						.join(" ");

					return (
						<div key={i} className="sidebar__segment">
							{/* line BEFORE the dot — done when previous section passed */}
							<div className={`sidebar__line ${i <= activeIndex ? "done" : ""}`} />
							<div className={dotClass} aria-label={SECTIONS[i]} />
						</div>
					);
				})}
				{/* trailing line after last dot */}
				<div className={`sidebar__line ${activeIndex >= SECTIONS.length - 1 ? "done" : ""}`} />
			</div>
		</nav>
	);
}

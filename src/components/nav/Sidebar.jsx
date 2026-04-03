import { useScrollSpy } from "../../hooks/useScrollSpy";
import { sections } from "../../data/siteData";
import "./Sidebar.css";

export default function Sidebar() {
	const { activeIndex } = useScrollSpy();

	return (
		<nav className="sidebar" aria-label="Page sections">
			<div className="sidebar__track">
				{sections.map((_, i) => (
					<div key={i} className="sidebar__segment">
						<div className={`sidebar__line ${i <= activeIndex ? "done" : ""}`} />
						<div
							className={["sidebar__dot", i < activeIndex ? "done" : "", i === activeIndex ? "active" : ""].join(" ")}
							aria-label={sections[i]}
						/>
					</div>
				))}
				{/* trailing line after last dot */}
				<div className={`sidebar__line ${activeIndex >= sections.length - 1 ? "done" : ""}`} />
			</div>
		</nav>
	);
}

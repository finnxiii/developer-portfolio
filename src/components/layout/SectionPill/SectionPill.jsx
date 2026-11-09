import { useStage } from "../../stage/StageContext";
import "./SectionPill.scss";

export default function SectionPill() {
	const { scenes, activeId } = useStage();

	if (!scenes.length) return null;

	const scrollTo = (id) => {
		const el = document.getElementById(id);
		if (!el) return;
		el.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	return (
		<nav className="section-pill" aria-label="Sections on this page">
			{scenes.map(({ id, fn, ln }) => {
				const isActive = activeId === id;
				return (
					<button
						key={id}
						type="button"
						className={"section-pill__item" + (isActive ? " section-pill__item--active" : "")}
						aria-label={fn}
						aria-current={isActive ? "true" : undefined}
						onClick={() => scrollTo(id)}
					>
						<span className="section-pill__ln">{ln}</span>
						<span
							className="section-pill__dot"
							style={{
								background: isActive ? "var(--breakpoint)" : "transparent",
								borderColor: isActive ? "var(--breakpoint)" : "var(--faint)",
							}}
						/>
						<span className="section-pill__tip" role="tooltip">{fn}</span>
					</button>
				);
			})}
		</nav>
	);
}

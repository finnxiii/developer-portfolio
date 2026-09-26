/* eslint-disable react-refresh/only-export-components */
import "./Figures.scss";
import VigilFigure from "./VigilFigure";
import MccFigure from "./MccFigure";
import SortsFigure from "./SortsFigure";

export { VigilFigure, MccFigure, SortsFigure };

export const FIGURES = {
	vigil: VigilFigure,
	"meeting-cost-calculator": MccFigure,
	sorts: SortsFigure,
};

export function ProjectFigure({ slug, caption, compact = false }) {
	const FigureComponent = FIGURES[slug];
	if (!FigureComponent) return null;

	// Split "Fig. 1 — description text" into label and body
	const dashIdx = caption ? caption.indexOf(" — ") : -1;
	const figLabel = dashIdx >= 0 ? caption.slice(0, dashIdx) : caption;
	const figText  = dashIdx >= 0 ? caption.slice(dashIdx + 3) : "";

	return (
		<figure className={`project-figure${compact ? " project-figure--compact" : ""}`}>
			<FigureComponent compact={compact} />
			{!compact && caption && (
				<figcaption className="project-figure__caption">
					<span className="project-figure__fig-label">{figLabel}</span>
					{figText && <> — {figText}</>}
				</figcaption>
			)}
		</figure>
	);
}

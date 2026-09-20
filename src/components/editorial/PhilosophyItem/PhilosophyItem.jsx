import { Link } from "react-router-dom";
import "./PhilosophyItem.scss";

export default function PhilosophyItem({ principle, position, example, projectLink, showExample = false }) {
	return (
		<div className="philosophy-item">
			<h3 className="philosophy-item__principle">{principle}</h3>
			{position && (
				<p className="philosophy-item__position">{position}</p>
			)}
			{showExample && example && (
				<p className="philosophy-item__example">{example}</p>
			)}
			{projectLink && (
				<Link to={projectLink} className="philosophy-item__link">
					See in practice <span className="arrow">→</span>
				</Link>
			)}
		</div>
	);
}

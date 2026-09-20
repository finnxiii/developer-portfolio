import { Link } from "react-router-dom";
import "./StoryLead.scss";

export default function StoryLead({ eyebrow, headline, standfirst, ctaLabel, ctaTo }) {
	return (
		<div className="story-lead">
			{eyebrow && (
				<span className="story-lead__eyebrow label-text">{eyebrow}</span>
			)}
			<h1 className="story-lead__headline">{headline}</h1>
			{standfirst && (
				<p className="story-lead__standfirst">{standfirst}</p>
			)}
			{ctaTo && ctaLabel && (
				<Link to={ctaTo} className="story-lead__cta">
					{ctaLabel} <span className="arrow">→</span>
				</Link>
			)}
		</div>
	);
}

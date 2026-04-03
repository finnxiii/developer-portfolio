import { useReveal } from "../hooks/useReveal";
import SectionBlock from "../components/ui/SectionBlock";
import { about, experience } from "../data/siteData";
import "../components/ui/SectionBlock.css";
import "./About.css";

export default function About() {
	useReveal();

	return (
		<SectionBlock id="about" label="About" title={about.heading}>
			<p className="about__body rv" style={{ transitionDelay: ".11s" }}>
				{about.body}
			</p>

			<div className="about__stats rv" style={{ transitionDelay: ".17s" }}>
				{about.stats.map(({ value, label }) => (
					<div className="stat-card" key={label}>
						<div className="stat-card__bar" />
						<div className="stat-card__value">{value}</div>
						<div className="stat-card__key">{label}</div>
					</div>
				))}
			</div>

			<p className="about__sub-label rv" style={{ transitionDelay: ".22s" }}>
				Experience
			</p>

			<div className="timeline rv" style={{ transitionDelay: ".27s" }}>
				<div className="timeline__line" />
				{experience.map((item, i) => (
					<TimelineItem key={i} item={item} />
				))}
			</div>
		</SectionBlock>
	);
}

function TimelineItem({ item }) {
	const content = <TimelineEntry item={item} />;

	return (
		<div className="timeline__item">
			<div className="timeline__content timeline__content--left">{item.side === "left" && content}</div>

			<div className="timeline__node">
				<div className="timeline__dot" />
			</div>

			<div className="timeline__content timeline__content--right">{item.side === "right" && content}</div>
		</div>
	);
}

function TimelineEntry({ item }) {
	return (
		<>
			<p className="tl__year">{item.year}</p>
			<p className="tl__title">{item.title}</p>
			{item.place && <p className="tl__place">{item.place}</p>}
			<p className="tl__desc">{item.desc}</p>
		</>
	);
}

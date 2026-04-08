import { useReveal } from "../../hooks/useReveal";
import SectionBlock, { RvWrap } from "../../components/ui/SectionBlock";
import { about, experience } from "../../data";
import "./About.scss";

export default function About() {
	useReveal();

	return (
		<SectionBlock id="about" label={about.heading} tagline={about.tagline}>
			<RvWrap delay=".08s">
				<div className="about__body">
					{about.body.split("\n\n").map((para, i) => (
						<p key={i}>{para}</p>
					))}
				</div>
			</RvWrap>

			<RvWrap delay=".18s">
				<p className="about__sub-label">Experience</p>
			</RvWrap>

			<RvWrap delay=".26s">
				<div className="timeline">
					<div className="timeline__line" />
					{experience.map((item, i) => (
						<TimelineItem key={i} item={item} />
					))}
				</div>
			</RvWrap>
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

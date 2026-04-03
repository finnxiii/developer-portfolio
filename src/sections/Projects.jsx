import SectionBlock from "../components/ui/SectionBlock";
import LiquidButton from "../components/ui/LiquidButton";
import { projects } from "../data/siteData";
import { useReveal } from "../hooks/useReveal";
import "../components/ui/SectionBlock.css";
import "./Projects.css";

const CARD_COLOURS = ["var(--c-pink)", "var(--c-blue)", "var(--c-green)"];

export default function Projects() {
	useReveal();
	return (
		<SectionBlock id="projects" label="Projects" title="A few things I have shipped.">
			<div className="proj__grid rv" style={{ transitionDelay: ".12s" }}>
				{projects.map((p, i) => (
					<ProjectCard key={p.id} project={p} index={i} />
				))}
			</div>
			<div className="rv" style={{ textAlign: "center", transitionDelay: ".18s" }}>
				<LiquidButton onClick={() => {}}>All Projects &nbsp;→</LiquidButton>
			</div>
		</SectionBlock>
	);
}

function ProjectCard({ project, index }) {
	const colour = CARD_COLOURS[index % CARD_COLOURS.length];
	return (
		<div className="proj-card">
			<div className="proj-card__img">
				<div className="proj-card__img-bg" style={{ background: `linear-gradient(135deg, ${colour}28, ${colour}0a)` }}>
					<span className="proj-card__icon" style={{ color: colour }}>
						{project.icon}
					</span>
				</div>
				<div className="proj-card__bar" style={{ background: colour }} />
			</div>

			<div className="proj-card__body">
				<p className="proj-card__name">{project.name}</p>
				<p className="proj-card__desc">{project.desc}</p>
				<div className="proj-card__tags">
					{project.tags.map((t) => (
						<span className="proj-card__tag" key={t}>
							{t}
						</span>
					))}
				</div>
			</div>

			<div className="proj-card__footer">
				<div className="proj-card__links">
					<a href={project.github} className="proj-card__link" target="_blank" rel="noreferrer">
						⌥
					</a>
					<a href={project.live} className="proj-card__link" target="_blank" rel="noreferrer">
						↗
					</a>
				</div>
				<span className="proj-card__arr">↗</span>
			</div>
		</div>
	);
}

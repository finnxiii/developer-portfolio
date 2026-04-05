import SectionBlock from "../components/ui/SectionBlock";
import LiquidButton from "../components/ui/LiquidButton";
import { projects } from "../data/siteData";
import { useReveal } from "../hooks/useReveal";
import { FiGithub, FiExternalLink } from "react-icons/fi";
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
			<div className="proj__cta rv" style={{ transitionDelay: ".18s" }}>
				<LiquidButton href="https://github.com/finnxiii">My Other Projects &nbsp;→</LiquidButton>
			</div>
		</SectionBlock>
	);
}

function ProjectCard({ project, index }) {
	console.log(project.name, project.image);
	const colour = CARD_COLOURS[index % CARD_COLOURS.length];

	return (
		<div className="proj-card">
			{/* image area */}
			<div className="proj-card__img">
				{project.image ? (
					<img src={project.image} alt={project.name} className="proj-card__img-photo" />
				) : (
					<div
						className="proj-card__img-bg"
						style={{ background: `linear-gradient(135deg, ${colour}28, ${colour}0a)` }}
					>
						<span className="proj-card__icon" style={{ color: colour }}>
							{project.icon}
						</span>
					</div>
				)}
				{/* colour bar at bottom of image */}
				<div className="proj-card__bar" style={{ background: colour }} />
			</div>

			{/* body */}
			<div className="proj-card__body">
				<h3 className="proj-card__name">{project.name}</h3>
				<p className="proj-card__desc">{project.desc}</p>

				{/* tags */}
				{project.tags?.length > 0 && (
					<div className="proj-card__tags">
						{project.tags.map((t) => (
							<span className="proj-card__tag" key={t}>
								{t}
							</span>
						))}
					</div>
				)}
			</div>

			{/* footer — only show icons if links are non-empty */}
			{(project.github || project.live) && (
				<div className="proj-card__footer">
					<div className="proj-card__links">
						{project.github && (
							<a href={project.github} className="proj-card__link" target="_blank" rel="noreferrer" aria-label="GitHub">
								<FiGithub size={16} />
							</a>
						)}
						{project.live && (
							<a
								href={project.live}
								className="proj-card__link"
								target="_blank"
								rel="noreferrer"
								aria-label="Live preview"
							>
								<FiExternalLink size={16} />
							</a>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

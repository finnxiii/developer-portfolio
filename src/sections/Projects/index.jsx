import SectionBlock, { RvWrap } from "../../components/ui/SectionBlock";
import LiquidButton from "../../components/ui/LiquidButton";
import { projects } from "../../data";
import { useReveal } from "../../hooks/useReveal";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import { CARD_COLOURS } from "../../constants";
import "./Projects.scss";

export default function Projects() {
	useReveal();
	return (
		<SectionBlock id="projects" label="Projects">
			<RvWrap delay=".1s">
				<div className="proj__grid">
					{projects.map((p, i) => (
						<ProjectCard key={p.id} project={p} index={i} />
					))}
				</div>
			</RvWrap>

			<RvWrap delay=".2s">
				<div className="proj__cta">
					<LiquidButton href="https://github.com/finnxiii">My Other Projects &nbsp;→</LiquidButton>
				</div>
			</RvWrap>
		</SectionBlock>
	);
}

function ProjectCard({ project, index }) {
	const colour = CARD_COLOURS[index % CARD_COLOURS.length];

	return (
		<div className="proj-card">
			<div className="proj-card__img">
				{project.image ? (
					<img
						src={project.image}
						alt={project.name}
						className="proj-card__img-photo"
						style={{ objectPosition: project.imageFocus || "center" }}
					/>
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
				<div className="proj-card__bar" style={{ background: colour }} />
			</div>

			<div className="proj-card__body">
				<h3 className="proj-card__name">{project.name}</h3>
				<p className="proj-card__desc">{project.desc}</p>
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

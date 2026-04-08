import { useState, useEffect } from "react";
import SectionBlock, { RvWrap } from "../../components/ui/SectionBlock";
import LiquidButton from "../../components/ui/LiquidButton";
import { projects } from "../../data";
import { useReveal } from "../../hooks/useReveal";
import { FiGithub, FiExternalLink, FiX } from "react-icons/fi";
import { CARD_COLOURS } from "../../constants";
import "./Projects.scss";

export default function Projects() {
	useReveal();
	const [selected, setSelected] = useState(null);
	const selectedIndex = selected ? projects.findIndex((p) => p.id === selected.id) : -1;

	useEffect(() => {
		const onKey = (e) => {
			if (e.key === "Escape") setSelected(null);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	useEffect(() => {
		document.body.style.overflow = selected ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [selected]);

	return (
		<SectionBlock id="projects" label="Projects">
			<RvWrap delay=".1s">
				<div className="proj__grid">
					{projects.map((p, i) => (
						<ProjectCard key={p.id} project={p} index={i} onClick={() => setSelected(p)} />
					))}
				</div>
			</RvWrap>

			<RvWrap delay=".2s">
				<div className="proj__cta">
					<LiquidButton href="https://github.com/finnxiii">My Other Projects &nbsp;→</LiquidButton>
				</div>
			</RvWrap>

			{/* overlay */}
			{selected && (
				<div className="proj-overlay" onClick={() => setSelected(null)}>
					<div className="proj-modal" onClick={(e) => e.stopPropagation()}>
						{/* title bar */}
						<div className="proj-modal__titlebar">
							<button className="proj-modal__close" onClick={() => setSelected(null)} aria-label="Close">
								<FiX size={8} />
							</button>
							<span className="proj-modal__window-title">{selected.name.toLowerCase()}</span>
						</div>

						{/* image */}
						<div
							className="proj-modal__img"
							style={{
								background: `linear-gradient(135deg, ${CARD_COLOURS[selectedIndex % CARD_COLOURS.length]}28, ${CARD_COLOURS[selectedIndex % CARD_COLOURS.length]}0a)`,
							}}
						>
							{selected.image ? (
								<img
									src={selected.image}
									alt={selected.name}
									className="proj-modal__img-photo"
									style={{ objectPosition: selected.imageFocus || "center" }}
								/>
							) : (
								<span
									className="proj-modal__img-icon"
									style={{ color: CARD_COLOURS[selectedIndex % CARD_COLOURS.length] }}
								>
									{selected.icon}
								</span>
							)}
							<div
								className="proj-modal__img-bar"
								style={{ background: CARD_COLOURS[selectedIndex % CARD_COLOURS.length] }}
							/>
						</div>

						{/* body */}
						<div className="proj-modal__body">
							<h3 className="proj-modal__name">{selected.name}</h3>
							<p className="proj-modal__desc">{selected.desc}</p>

							{selected.tags?.length > 0 && (
								<div className="proj-modal__tags">
									{selected.tags.map((t) => (
										<span className="proj-modal__tag" key={t}>
											{t}
										</span>
									))}
								</div>
							)}

							{(selected.github || selected.live) && (
								<div className="proj-modal__links">
									{selected.github && (
										<a href={selected.github} className="proj-modal__link" target="_blank" rel="noreferrer">
											<FiGithub size={14} /> GitHub
										</a>
									)}
									{selected.live && (
										<a href={selected.live} className="proj-modal__link" target="_blank" rel="noreferrer">
											<FiExternalLink size={14} /> Live
										</a>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</SectionBlock>
	);
}

function ProjectCard({ project, index, onClick }) {
	const colour = CARD_COLOURS[index % CARD_COLOURS.length];

	return (
		<div className="proj-card" onClick={onClick}>
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
							<a
								href={project.github}
								className="proj-card__link"
								target="_blank"
								rel="noreferrer"
								aria-label="GitHub"
								onClick={(e) => e.stopPropagation()}
							>
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
								onClick={(e) => e.stopPropagation()}
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

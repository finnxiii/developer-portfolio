import TechTag from "../TechTag/TechTag";
import "./ProjectFacts.scss";

export default function ProjectFacts({ project }) {
	const { role, team, timeframe, status, stack = [], github, live } = project;

	return (
		<div className="project-facts">
			<h2 className="project-facts__heading label-text">Project Facts</h2>

			<dl className="project-facts__list">
				{role && (
					<div className="project-facts__row">
						<dt>Role</dt>
						<dd>{role}</dd>
					</div>
				)}
				{team && (
					<div className="project-facts__row">
						<dt>Team</dt>
						<dd>{team}</dd>
					</div>
				)}
				{timeframe && (
					<div className="project-facts__row">
						<dt>Timeframe</dt>
						<dd>{timeframe}</dd>
					</div>
				)}
				{status && (
					<div className="project-facts__row">
						<dt>Status</dt>
						<dd>{status}</dd>
					</div>
				)}
				{stack.length > 0 && (
					<div className="project-facts__row project-facts__row--stack">
						<dt>Stack</dt>
						<dd>
							<div className="project-facts__tags">
								{stack.map((t) => (
									<TechTag key={t} label={t} />
								))}
							</div>
						</dd>
					</div>
				)}
			</dl>

			{(github || live) && (
				<div className="project-facts__links">
					{github && (
						<a
							href={github}
							className="project-facts__link"
							target="_blank"
							rel="noopener noreferrer"
						>
							View on GitHub ↗
						</a>
					)}
					{live && (
						<a
							href={live}
							className="project-facts__link"
							target="_blank"
							rel="noopener noreferrer"
						>
							Live project ↗
						</a>
					)}
				</div>
			)}

			{!github && (
				<p className="project-facts__private">Repository is private.</p>
			)}
		</div>
	);
}

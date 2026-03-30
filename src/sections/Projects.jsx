import RevealTextBlock from "../components/layout/RevealTextBlock";

function Projects() {
	return (
		<section
			id="projects"
			className="border-t border-[var(--surface-border)] bg-[var(--surface-1)] px-6 py-24 text-[var(--about-text)]"
		>
			<div className="mx-auto max-w-6xl">
				<RevealTextBlock>
					<p className="mb-4 text-xs font-medium uppercase tracking-[0.24em] text-[var(--about-text-muted)]">
						Projects
					</p>

					<h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
						Selected work that reflects how I think, build, and learn.
					</h2>
				</RevealTextBlock>

				<div className="mt-12 grid gap-6 lg:grid-cols-2">
					{[
						{
							title: "Portfolio Website",
							desc: "A cinematic single-page portfolio exploring scroll-based transitions, premium visual design, and responsive frontend engineering.",
						},
						{
							title: "Discord Job Finder",
							desc: "A real-world bot and web companion concept focused on helping students and early-career job seekers discover relevant opportunities.",
						},
					].map((project, index) => (
						<RevealTextBlock key={project.title} delay={index * 0.08}>
							<div className="rounded-3xl border border-[var(--surface-border)] bg-[var(--surface-card)] p-6 backdrop-blur-sm">
								<h3 className="text-xl font-semibold">{project.title}</h3>
								<p className="mt-4 max-w-xl leading-8 text-[var(--about-text-soft)]">{project.desc}</p>
							</div>
						</RevealTextBlock>
					))}
				</div>
			</div>
		</section>
	);
}

export default Projects;

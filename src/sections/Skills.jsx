import RevealTextBlock from "../components/layout/RevealTextBlock";

function Skills() {
	return (
		<section
			id="skills"
			className="border-t border-[var(--surface-border)] bg-[var(--surface-0)] px-6 py-24 text-[var(--about-text)]"
		>
			<div className="mx-auto max-w-6xl">
				<RevealTextBlock>
					<p className="mb-4 text-xs font-medium uppercase tracking-[0.24em] text-[var(--about-text-muted)]">Skills</p>

					<h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
						A growing toolkit across modern software development.
					</h2>
				</RevealTextBlock>

				<div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
					{[
						{
							title: "Frontend",
							items: ["React", "Tailwind CSS", "JavaScript", "Responsive Design"],
						},
						{
							title: "Backend",
							items: ["Node.js", "Express", "Java", "REST APIs"],
						},
						{
							title: "Mobile",
							items: ["Kotlin", "Jetpack Compose", "Android Development"],
						},
						{
							title: "Tools & More",
							items: ["Git", "GitHub", "Figma", "MongoDB"],
						},
					].map((group, index) => (
						<RevealTextBlock key={group.title} delay={index * 0.08}>
							<div className="rounded-3xl border border-[var(--surface-border)] bg-[var(--surface-card)] p-6 backdrop-blur-sm">
								<h3 className="text-lg font-semibold">{group.title}</h3>

								<div className="mt-4 flex flex-wrap gap-2">
									{group.items.map((item) => (
										<span
											key={item}
											className="rounded-full border border-[var(--surface-border)] bg-white/30 px-3 py-1 text-sm text-[var(--about-text-soft)] transition hover:bg-white/50 hover:text-[var(--about-text)]"
										>
											{item}
										</span>
									))}
								</div>
							</div>
						</RevealTextBlock>
					))}
				</div>
			</div>
		</section>
	);
}

export default Skills;

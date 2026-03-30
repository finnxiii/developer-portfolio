import RevealTextBlock from "../components/layout/RevealTextBlock";

function Contact() {
	return (
		<section
			id="contact"
			className="border-t border-[var(--surface-border)] bg-[var(--surface-2)] px-6 py-24 text-[var(--about-text)]"
		>
			<div className="mx-auto max-w-6xl">
				<RevealTextBlock>
					<p className="mb-4 text-xs font-medium uppercase tracking-[0.24em] text-[var(--about-text-muted)]">Contact</p>

					<h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
						Let’s build something meaningful.
					</h2>

					<p className="mt-6 max-w-2xl leading-8 text-[var(--about-text-soft)]">
						I’m interested in software engineering opportunities, collaborative projects, and building thoughtful
						digital experiences.
					</p>

					<div className="mt-8 flex flex-wrap gap-4">
						<a
							href="mailto:your@email.com"
							className="rounded-full border border-[var(--surface-border)] bg-white/35 px-5 py-3 text-sm font-medium transition hover:bg-white/55"
						>
							Email Me
						</a>

						<a
							href="https://github.com/finnxiii"
							target="_blank"
							rel="noopener noreferrer"
							className="rounded-full border border-[var(--surface-border)] bg-white/25 px-5 py-3 text-sm font-medium transition hover:bg-white/45"
						>
							GitHub
						</a>
					</div>
				</RevealTextBlock>
			</div>
		</section>
	);
}

export default Contact;

import RevealTextBlock from "../components/layout/RevealTextBlock";

function About() {
	return (
		<section
			id="about"
			className="min-h-screen border-t border-[var(--surface-border)] px-6 py-24 text-[var(--about-text)]"
		>
			<div className="mx-auto flex min-h-screen max-w-6xl items-center">
				<RevealTextBlock className="max-w-3xl">
					<p className="mb-4 text-xs font-medium uppercase tracking-[0.24em] text-[var(--about-text-muted)]">
						About Me
					</p>

					<h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
						Building software with creativity, clarity, and real-world purpose.
					</h2>

					<p className="mt-6 max-w-2xl text-base leading-8 text-[var(--about-text-soft)]">
						I’m a Computer Science student focused on modern web apps, developer tools, and thoughtful software
						experiences. I enjoy combining technical depth with clean design to build projects that feel useful and
						intentional.
					</p>
				</RevealTextBlock>
			</div>
		</section>
	);
}

export default About;

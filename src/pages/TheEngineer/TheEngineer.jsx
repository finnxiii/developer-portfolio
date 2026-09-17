import { useRef } from "react";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import Rule from "../../components/ui/Rule/Rule";
import SEOHead from "../../components/ui/SEOHead/SEOHead";
import "./TheEngineer.scss";

export default function TheEngineer() {
	const containerRef = useRef(null);
	useScrollReveal(containerRef);

	const { data } = usePortfolioData();
	const { profile } = data;
	const { name, role, university, graduation, location, bio, interests = [], links = {} } = profile;

	return (
		<div className="the-engineer" ref={containerRef}>
			<SEOHead
				title={`${name} — The Engineer`}
				description={bio}
			/>
			<div className="container">

				<header className="the-engineer__header rv">
					<span className="the-engineer__eyebrow label-text">The Engineer</span>
					<h1 className="the-engineer__name">{name}</h1>
					<p className="the-engineer__role">{role}</p>
					{(university || location) && (
						<p className="the-engineer__meta">
							{[university, graduation && `(${graduation})`, location].filter(Boolean).join(" · ")}
						</p>
					)}
				</header>

				<Rule />

				<div className="the-engineer__body">
					<div className="the-engineer__main">
						{bio && (
							<section className="the-engineer__section rv" data-reveal-delay="0.05">
								<h2 className="the-engineer__section-title label-text">Background</h2>
								<p className="the-engineer__bio">{bio}</p>
							</section>
						)}

						{interests.length > 0 && (
							<section className="the-engineer__section rv" data-reveal-delay="0.1">
								<h2 className="the-engineer__section-title label-text">Areas of Interest</h2>
								<ul className="the-engineer__interests" role="list">
									{interests.map((interest) => (
										<li key={interest}>{interest}</li>
									))}
								</ul>
							</section>
						)}

						<section className="the-engineer__section rv" data-reveal-delay="0.15">
							<h2 className="the-engineer__section-title label-text">Working Style</h2>
							<p className="the-engineer__body-text">
								I prefer to understand a constraint fully before picking a tool. I work best
								when I can see the shape of the problem clearly — what is fixed, what is
								flexible, and where the real cost is. Trade-offs are normal; hiding them is
								not. I write code that communicates intent, add comments only when the why
								is non-obvious, and ship small reliable things before ambitious fragile ones.
							</p>
						</section>
					</div>

					<aside className="the-engineer__sidebar rv" data-reveal-delay="0.08">
						<div className="the-engineer__contact">
							<p className="the-engineer__contact-label label-text">Contact & Links</p>
							<ul className="the-engineer__contact-list" role="list">
								{links.email && (
									<li>
										<a href={`mailto:${links.email}`} className="the-engineer__contact-link">
											{links.email}
										</a>
									</li>
								)}
								{links.github && (
									<li>
										<a href={links.github} className="the-engineer__contact-link" target="_blank" rel="noopener noreferrer">
											GitHub ↗
										</a>
									</li>
								)}
								{links.linkedin && (
									<li>
										<a href={links.linkedin} className="the-engineer__contact-link" target="_blank" rel="noopener noreferrer">
											LinkedIn ↗
										</a>
									</li>
								)}
								{links.cv && (
									<li>
										<a href={links.cv} className="the-engineer__contact-link the-engineer__contact-link--cta" download>
											Download CV (PDF)
										</a>
									</li>
								)}
							</ul>
						</div>
					</aside>
				</div>

			</div>
		</div>
	);
}

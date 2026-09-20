import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import PhilosophyItem from "../../components/editorial/PhilosophyItem/PhilosophyItem";
import TimelineEntry from "../../components/editorial/TimelineEntry/TimelineEntry";
import Rule from "../../components/ui/Rule/Rule";
import SEOHead from "../../components/ui/SEOHead/SEOHead";
import "./TheEngineer.scss";

export default function TheEngineer() {
	const containerRef = useRef(null);
	useScrollReveal(containerRef);

	const { hash } = useLocation();

	// Scroll to hash anchor after mount
	useEffect(() => {
		if (!hash) return;
		const id = hash.replace("#", "");
		const el = document.getElementById(id);
		if (el) {
			setTimeout(() => {
				el.scrollIntoView({ behavior: "smooth", block: "start" });
			}, 100);
		}
	}, [hash]);

	const { data } = usePortfolioData();
	const { profile, philosophy = [], experience = [] } = data;
	const { name, role, university, graduation, location, bio, interests = [], links = {} } = profile;

	return (
		<div className="the-engineer" ref={containerRef}>
			<SEOHead
				title="The Engineer"
				description={bio}
			/>
			<div className="container">

				<header className="the-engineer__header rv">
					<span className="the-engineer__eyebrow">The Engineer</span>
					<h1 className="the-engineer__name">{name}</h1>
					<p className="the-engineer__role">{role}</p>
					{(university || location) && (
						<p className="the-engineer__meta">
							{[university, graduation && `(${graduation})`, location].filter(Boolean).join(" · ")}
						</p>
					)}
				</header>

				<Rule />

				{/* ── Section 1: Bio ── */}
				<div className="the-engineer__body">
					<div className="the-engineer__main">
						{bio && (
							<section className="the-engineer__section rv" data-reveal-delay="0.05">
								<h2 className="the-engineer__section-title">Background</h2>
								<p className="the-engineer__bio">{bio}</p>
							</section>
						)}

						{interests.length > 0 && (
							<section className="the-engineer__section rv" data-reveal-delay="0.1">
								<h2 className="the-engineer__section-title">Areas of Interest</h2>
								<ul className="the-engineer__interests" role="list">
									{interests.map((interest) => (
										<li key={interest}>{interest}</li>
									))}
								</ul>
							</section>
						)}

						<section className="the-engineer__section rv" data-reveal-delay="0.15">
							<h2 className="the-engineer__section-title">Working Style</h2>
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
							<p className="the-engineer__contact-label">Contact & Links</p>
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

				{/* ── Section 2: Engineering Philosophy ── */}
				{philosophy.length > 0 && (
					<>
						<Rule />
						<section id="philosophy" className="the-engineer__philosophy rv" data-reveal-delay="0.05">
							<h2 className="the-engineer__chapter-label">Engineering Philosophy</h2>
							<p className="the-engineer__chapter-deck">
								Operating principles — not generic values. Each is grounded in real decisions, real constraints, and real projects.
							</p>
							<div className="the-engineer__philosophy-list">
								{philosophy.map((item, i) => (
									<div key={i} className="rv" data-reveal-delay={i * 0.07}>
										<PhilosophyItem {...item} showExample />
									</div>
								))}
							</div>
						</section>
					</>
				)}

				{/* ── Section 3: Career Desk ── */}
				{experience.length > 0 && (
					<>
						<Rule />
						<section id="career" className="the-engineer__career rv" data-reveal-delay="0.05">
							<div className="the-engineer__career-header">
								<div>
									<h2 className="the-engineer__chapter-label">Career Desk</h2>
									<p className="the-engineer__chapter-deck">
										Education, roles, and responsibilities — in reverse-chronological order. A readable layer on top of the CV.
									</p>
								</div>
								{links.cv && (
									<a href={links.cv} className="the-engineer__cv-btn" download>
										Download CV (PDF) ↓
									</a>
								)}
							</div>
							<div className="the-engineer__timeline">
								{experience.map((entry, i) => (
									<div key={i} className="rv" data-reveal-delay={i * 0.08}>
										<TimelineEntry {...entry} />
									</div>
								))}
							</div>
							{links.cv && (
								<div className="the-engineer__career-footer">
									<p className="the-engineer__career-note">
										The CV contains the full picture, including grades, links, and details not listed here.
									</p>
									<a href={links.cv} className="the-engineer__cv-btn" download>
										Download CV (PDF) ↓
									</a>
								</div>
							)}
						</section>
					</>
				)}

			</div>
		</div>
	);
}

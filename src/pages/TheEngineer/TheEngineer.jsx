import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import PhilosophyItem from "../../components/editorial/PhilosophyItem/PhilosophyItem";
import Timeline from "../../components/editorial/Timeline/Timeline";
import Rule from "../../components/ui/Rule/Rule";
import SEOHead from "../../components/ui/SEOHead/SEOHead";
import "./TheEngineer.scss";

export default function TheEngineer() {
	const containerRef = useRef(null);
	useScrollReveal(containerRef);

	const { hash } = useLocation();
	useEffect(() => {
		if (!hash) return;
		const id = hash.replace("#", "");
		const el = document.getElementById(id);
		if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
	}, [hash]);

	const { data } = usePortfolioData();
	const { profile, philosophy = [], experience = [], currentFocus } = data;
	const {
		name, role, university, graduation, location,
		bio, interests = [], links = {},
	} = profile;

	const bioParagraphs = (bio || "").split(/\n\n+/).filter(Boolean);

	return (
		<div className="the-engineer" ref={containerRef}>
			<SEOHead title="About" description={bio} />

			{/* ── Header ───────────────────────────────────────────────── */}
			<div className="container">
				<header className="te-header rv">
					<span className="te-header__kicker label-text">§3 · About</span>
					<h1 className="te-header__name">{name}</h1>
					<p className="te-header__subtitle">{role} · {university}</p>
				</header>
			</div>

			<Rule />

			{/* ── Two-column body ───────────────────────────────────────── */}
			<div className="container">
				<div className="te-body">

					{/* ── Main column ──────────────────────────────────── */}
					<div className="te-main">

						{/* Bio prose */}
						{bioParagraphs.length > 0 && (
							<section className="te-section rv" aria-label="Biography">
								<span className="te-section__label">About</span>
								<div className="te-section__body">
									{bioParagraphs.map((p, i) => (
										<p key={i} className="te-section__p">{p}</p>
									))}
								</div>
							</section>
						)}

						{/* Background */}
						<section className="te-section rv" data-reveal-delay="0.05" aria-label="Background">
							<span className="te-section__label">Background</span>
							<ul className="te-list" role="list">
								{location && <li className="te-list__item"><span className="te-list__key">Location</span> — {location}</li>}
								{university && <li className="te-list__item"><span className="te-list__key">University</span> — {university}</li>}
								{graduation && <li className="te-list__item"><span className="te-list__key">Graduating</span> — {graduation}</li>}
							</ul>
						</section>

						{/* Interests */}
						{interests.length > 0 && (
							<section className="te-section rv" data-reveal-delay="0.08" aria-label="Interests">
								<span className="te-section__label">Interests</span>
								<ul className="te-list" role="list">
									{interests.map((item, i) => (
										<li key={i} className="te-list__item">{item}</li>
									))}
								</ul>
							</section>
						)}

						{/* Philosophy preview */}
						{philosophy.length > 0 && (
							<>
								<Rule />
								<section id="how-i-work" style={{ scrollMarginTop: "80px" }} className="te-philosophy rv" data-reveal-delay="0.05">
									<span className="te-section__label">How I Work</span>
									<div className="te-philosophy__list">
										{philosophy.map((item, i) => (
											<div key={i} className="rv" data-reveal-delay={i * 0.06}>
												<PhilosophyItem {...item} showExample />
											</div>
										))}
									</div>
									<div className="te-philosophy__more">
										<Link to="/about#how-i-work" className="te-philosophy__more">
											How I work →
										</Link>
									</div>
								</section>
							</>
						)}
					</div>

					{/* ── Sidebar ───────────────────────────────────────── */}
					<aside className="te-sidebar rv" data-reveal-delay="0.1">

						{/* Contact */}
						<div className="te-sidebar__block">
							<span className="te-sidebar__label">Contact</span>
							<ul className="te-sidebar__list" role="list">
								{links.email && (
									<li>
										<a href={`mailto:${links.email}`} className="te-sidebar__link">
											Email ↗
										</a>
									</li>
								)}
								{links.github && (
									<li>
										<a href={links.github} className="te-sidebar__link" target="_blank" rel="noopener noreferrer">
											GitHub ↗
										</a>
									</li>
								)}
								{links.linkedin && (
									<li>
										<a href={links.linkedin} className="te-sidebar__link" target="_blank" rel="noopener noreferrer">
											LinkedIn ↗
										</a>
									</li>
								)}
								{links.cv && (
									<li>
										<a href={links.cv} className="te-sidebar__link te-sidebar__link--cta" target="_blank" rel="noopener noreferrer">
											Download CV (PDF)
										</a>
									</li>
								)}
							</ul>
						</div>

						{/* Currently */}
						{currentFocus && (
							<div className="te-sidebar__block">
								<span className="te-sidebar__label">Currently</span>
								<ul className="te-sidebar__list" role="list">
									{currentFocus.building && (
										<li>
											<span className="te-sidebar__sub">Building</span>
											{currentFocus.buildingLink
												? <Link to={currentFocus.buildingLink} className="te-sidebar__link">{currentFocus.buildingShort || currentFocus.building}</Link>
												: <span className="te-sidebar__val">{currentFocus.buildingShort || currentFocus.building}</span>
											}
										</li>
									)}
									{currentFocus.learning && (
										<li>
											<span className="te-sidebar__sub">Learning</span>
											<span className="te-sidebar__val">{currentFocus.learningShort || currentFocus.learning}</span>
										</li>
									)}
									{currentFocus.exploring && (
										<li>
											<span className="te-sidebar__sub">Exploring</span>
											<span className="te-sidebar__val">{currentFocus.exploringShort || currentFocus.exploring}</span>
										</li>
									)}
								</ul>
								<Link to="/now" className="te-sidebar__more">
									View /now page →
								</Link>
							</div>
						)}

					</aside>
				</div>
			</div>

			{/* ── Experience timeline ───────────────────────────────────── */}
			{experience.length > 0 && (
				<section id="experience" style={{ scrollMarginTop: "80px" }} aria-label="Experience">
					<Timeline experience={experience} />
				</section>
			)}

			{/* ── CV CTA ───────────────────────────────────────────────── */}
			<div className="container">
				<Rule />
				<div className="te-cta-row rv">
					{links.cv && (
						<a href={links.cv} className="btn btn--solid" target="_blank" rel="noopener noreferrer">
							Download CV (PDF)
						</a>
					)}
					{links.email && (
						<a href={`mailto:${links.email}`} className="btn btn--outline">
							Email me
						</a>
					)}
					<Link to="/about#experience" className="btn btn--outline">
						Full experience →
					</Link>
				</div>
			</div>
		</div>
	);
}

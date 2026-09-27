import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { getLenis } from "../../hooks/useSmoothScroll";
import SEOHead from "../../components/ui/SEOHead/SEOHead";
import WorkStories from "../../components/editorial/WorkStories/WorkStories";
import "./FrontPage.scss";

function firstSentence(text = "") {
	const m = text.match(/^[^.!?]+[.!?]/);
	return m ? m[0] : text.slice(0, 120);
}

function formatDateline(isoDate) {
	if (!isoDate) return "";
	const d = new Date(isoDate + "T12:00:00");
	return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" })
		.format(d)
		.toUpperCase();
}

function emphasizeWord(text, word) {
	if (!text) return text;
	const parts = text.split(new RegExp(`(\\b${word}\\b)`, "i"));
	return parts.map((part, i) =>
		part.toLowerCase() === word.toLowerCase()
			? <em key={i} className="fp-lead__headline-em">{part}</em>
			: part
	);
}

const EDITION_ITEMS = [
	{ label: "Selected Work", href: "#work",  page: "p.02" },
	{ label: "About",         href: "/about", page: "p.03" },
	{ label: "Field Notes",   href: "#notes", page: "p.04" },
	{ label: "Now",           href: "/now",   page: "p.05" },
];

export default function FrontPage() {
	const containerRef = useRef(null);
	const tickerRef = useRef(null);
	const prefersReduced = useReducedMotion();

	useScrollReveal(containerRef);

	// ── GSAP infinite ticker (replaces CSS animation) ─────────────
	useGSAP(
		() => {
			if (prefersReduced) return;
			const track = tickerRef.current;
			if (!track) return;

			const tl = gsap.to(track, {
				xPercent: -50,
				duration: 40,
				ease: "linear",
				repeat: -1,
			});

			// Speed up with scroll velocity, reset when scrolling stops
			let velocityTimer;
			const onScroll = () => {
				const lenis = getLenis();
				const vel = lenis ? Math.abs(lenis.velocity) : 0;
				if (vel > 0.05) {
					clearTimeout(velocityTimer);
					tl.timeScale(1 + Math.min(vel * 0.3, 3));
					velocityTimer = window.setTimeout(() => {
						gsap.to(tl, { timeScale: 1, duration: 0.8, ease: "power2.out" });
					}, 300);
				}
			};
			window.addEventListener("scroll", onScroll, { passive: true });

			// Pause on hover
			const tickerEl = track.closest(".fp-ticker");
			const pause = () => tl.pause();
			const resume = () => tl.resume();
			tickerEl?.addEventListener("mouseenter", pause);
			tickerEl?.addEventListener("mouseleave", resume);

			return () => {
				tl.kill();
				clearTimeout(velocityTimer);
				window.removeEventListener("scroll", onScroll);
				tickerEl?.removeEventListener("mouseenter", pause);
				tickerEl?.removeEventListener("mouseleave", resume);
			};
		},
		{ scope: containerRef, dependencies: [prefersReduced] }
	);

	const { data } = usePortfolioData();
	const { profile, projects = [], philosophy = [], experience = [], fieldNotes = [], currentFocus } = data;

	const allFeatured = projects.filter((p) => p.featured);
	const leadProject = allFeatured.find((p) => p.leadProject) ?? allFeatured[0];
	const supporting  = allFeatured.filter((p) => p !== leadProject);
	const orderedWork = leadProject ? [leadProject, ...supporting] : allFeatured;

	return (
		<div className="front-page" ref={containerRef}>
			<SEOHead
				title="Naing Htoo Lwin — The Build Log"
				raw
				description={`${profile?.heroStandfirst ?? ""} Selected builds, case studies, engineering philosophy, and field notes.`}
			/>

			{/* ── §1 Lead Story ───────────────────────────────────────── */}
			<section className="fp-lead" aria-label="Lead story">
				<div className="container">
					<div className="fp-lead__grid">

						<div className="fp-lead__story">
							<p className="fp-lead__kicker label-text">
								Lead story — Engineering profile
							</p>

							<h1 className="fp-lead__headline rv">
								{emphasizeWord(profile?.heroHeadline, "understand")}
							</h1>

							<div className="fp-lead__byline-wrap">
								<div className="fp-lead__byline-rule" aria-hidden="true" />
								<p className="fp-lead__byline">
									By <strong>{profile?.name}</strong> · {profile?.role} · {profile?.university}
								</p>
								<div className="fp-lead__byline-rule" aria-hidden="true" />
							</div>

							<div className="fp-lead__body rv">
								<div className="fp-lead__standfirst">
									<p className="drop-cap">{profile?.heroStandfirst}</p>
								</div>
							</div>

							<div className="fp-lead__ctas rv">
								<Link to="/work" className="btn btn--solid">
									Read selected work <span className="arrow">→</span>
								</Link>
								{profile?.links?.cv && (
								<a
									href={profile.links.cv}
									className="btn btn--outline"
									target="_blank"
									rel="noopener noreferrer"
								>
									Download CV (PDF)
								</a>
							)}
							</div>
						</div>

						<aside className="fp-lead__index" aria-label="In this edition">
							<div className="fp-edition">
								<h2 className="fp-edition__heading">On this page</h2>
								<ul className="fp-edition__list">
									{EDITION_ITEMS.map(({ label, href, page }) => (
										<li key={href} className="fp-edition__row">
											{href.startsWith("/") ? (
												<Link to={href} className="fp-edition__label">{label}</Link>
											) : (
												<a href={href} className="fp-edition__label">{label}</a>
											)}
											<span className="fp-edition__leader" aria-hidden="true" />
											<span className="fp-edition__page">{page}</span>
										</li>
									))}
								</ul>
							</div>

							{currentFocus && (
								<div className="fp-deskbox">
									<div className="fp-deskbox__header">
										Currently · {currentFocus.date}
									</div>
									<div className="fp-deskbox__body">
										{[
											{ label: "Building",  val: firstSentence(currentFocus.building) },
											{ label: "Learning",  val: firstSentence(currentFocus.learning) },
											{ label: "Exploring", val: firstSentence(currentFocus.exploring) },
										].map(({ label, val }, i) => (
											<div key={label} className={`fp-deskbox__row${i > 0 ? " fp-deskbox__row--ruled" : ""}`}>
												<span className="fp-deskbox__label">{label}</span>
												<p className="fp-deskbox__val">{val}</p>
											</div>
										))}
									</div>
								</div>
							)}
						</aside>

					</div>
				</div>
			</section>

			{/* ── §1↓ Ticker band ─────────────────────────────────────── */}
			<div className="fp-ticker" aria-hidden="true">
				<div className="fp-ticker__track" ref={tickerRef}>
					{[0, 1].map((copy) => (
						<span key={copy} className="fp-ticker__inner">
							{philosophy.map((item, i) => (
								<span key={i} className="fp-ticker__item">
									<span className="fp-ticker__sec">§{i + 1}</span>
									{item.principle}
									<span className="fp-ticker__sep">✦</span>
								</span>
							))}
						</span>
					))}
				</div>
			</div>

			{/* ── §2 Selected Work ────────────────────────────────────── */}
			<section id="work" className="fp-work" aria-labelledby="work-heading">
				<div className="container">
					<div className="fp-work__header rv">
						<h2 id="work-heading" className="fp-work__title">Selected Work</h2>
						<span className="fp-work__count">§2 · {allFeatured.length} stories</span>
					</div>
					<div className="fp-work__rule" aria-hidden="true" />

					<div className="rv">
						<WorkStories projects={orderedWork} />
					</div>

					<div className="fp-work__see-all rv">
						<Link to="/work" className="cta-link">
							View all projects <span className="arrow">→</span>
						</Link>
					</div>
				</div>
			</section>

			{/* ── §3–5 How I Work ─────────────────────────────────────── */}
			<section className="fp-policy" aria-labelledby="policy-heading">
				<div className="container">
					<div className="fp-policy__header rv">
						<h2 id="policy-heading" className="fp-policy__title">
							How I Work
						</h2>
						<span className="fp-policy__subtitle">§3 · Principles behind the projects</span>
					</div>
					<div className="fp-policy__grid">
						{philosophy.map((item, i) => (
							<div key={i} className="fp-policy__col rv" data-reveal-delay={i * 0.06}>
								<span className="fp-policy__num" aria-hidden="true">§{i + 1}</span>
								<p className="fp-policy__principle">{item.principle}</p>
								<p className="fp-policy__position">{item.position}</p>
								{item.projectLink && (
									<Link to={item.projectLink} className="fp-policy__link cta-link">
										In practice <span className="arrow">→</span>
									</Link>
								)}
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ── §6 Experience + Field Notes ─────────────────────────── */}
			<section id="notes" className="fp-two-col" aria-label="Experience and field notes">
				<div className="container">
					<div className="fp-two-col__grid">

						<div className="fp-two-col__left">
							<h2 className="fp-two-col__heading rv">Experience</h2>
							{experience.slice(0, 4).map((entry, i) => (
								<div key={i} className="fp-appt rv" data-reveal-delay={i * 0.06}>
									<span className="fp-appt__date">{entry.dateRange}</span>
									<div className="fp-appt__body">
										<strong className="fp-appt__org">{entry.org}</strong>
										<em className="fp-appt__role">{entry.role}</em>
									</div>
								</div>
							))}
							<div className="fp-two-col__see-all rv">
								<Link to="/about#experience" className="cta-link">
									Full experience <span className="arrow">→</span>
								</Link>
							</div>
						</div>

						<div className="fp-two-col__right">
							<div className="fp-two-col__heading-row rv">
								<h2 className="fp-two-col__heading">Field Notes</h2>
								<span className="fp-two-col__subtitle">Writing on what I build</span>
							</div>
							{fieldNotes.slice(0, 4).map((note, i) => (
								<div key={note.slug} className="fp-fnote rv" data-reveal-delay={i * 0.06}>
									<p className="fp-fnote__dateline">
										<span className="fp-fnote__place">
											Sheffield, {formatDateline(note.date)}
										</span>
										{" — "}{note.topic} · {note.readTime} read
									</p>
									<h3 className="fp-fnote__title">
										<Link to={`/notes/${note.slug}`}>{note.title}</Link>
									</h3>
								</div>
							))}
							<div className="fp-two-col__see-all rv">
								<Link to="/notes" className="cta-link">
									All field notes <span className="arrow">→</span>
								</Link>
							</div>
						</div>

					</div>
				</div>
			</section>

		</div>
	);
}

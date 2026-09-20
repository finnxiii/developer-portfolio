import { useRef } from "react";
import { Link } from "react-router-dom";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import Rule from "../../components/ui/Rule/Rule";
import SEOHead from "../../components/ui/SEOHead/SEOHead";
import StoryLead from "../../components/editorial/StoryLead/StoryLead";
import ProfileCard from "../../components/editorial/ProfileCard/ProfileCard";
import ArticleCard from "../../components/editorial/ArticleCard/ArticleCard";
import PhilosophyItem from "../../components/editorial/PhilosophyItem/PhilosophyItem";
import TimelineEntry from "../../components/editorial/TimelineEntry/TimelineEntry";
import FieldNoteCard from "../../components/editorial/FieldNoteCard/FieldNoteCard";
import CurrentFocusBlock from "../../components/editorial/CurrentFocusBlock/CurrentFocusBlock";
import "./FrontPage.scss";

export default function FrontPage() {
	const containerRef = useRef(null);
	useScrollReveal(containerRef);

	const { data } = usePortfolioData();

	const { profile, projects = [], philosophy = [], experience = [], fieldNotes = [], currentFocus } = data;

	const featuredProjects = projects.filter((p) => p.featured);
	const leadProject = featuredProjects.find((p) => p.leadProject) ?? featuredProjects[0];
	const supportingProjects = featuredProjects.filter((p) => p !== leadProject).slice(0, 3);

	return (
		<div className="front-page" ref={containerRef}>
			<SEOHead
				description={`${profile.heroStandfirst} Selected builds, case studies, engineering philosophy, and field notes.`}
			/>

			{/* ── Hero: Lead story + Profile ── */}
			<section className="front-page__hero" aria-label="Lead story">
				<div className="container">
					<div className="front-page__hero-grid">
						<div className="rv">
							<StoryLead
								eyebrow="Engineering Profile"
								headline={profile.heroHeadline}
								standfirst={profile.heroStandfirst}
								ctaLabel="Explore selected work"
								ctaTo="/work"
							/>
						</div>
						<div className="rv front-page__profile-col" data-reveal-delay="0.12">
							<ProfileCard profile={profile} />
						</div>
					</div>
				</div>
			</section>

			<Rule className="front-page__rule" />

			{/* ── Selected Work: newspaper grid ── */}
			<section className="front-page__work" aria-labelledby="work-heading">
				<div className="container">
					<h2 id="work-heading" className="front-page__section-label rv">
						Selected Work
					</h2>

					{/* Lead: full-width horizontal card */}
					{leadProject && (
						<div className="rv" data-reveal-delay="0.05">
							<ArticleCard project={leadProject} lead />
						</div>
					)}

					{/* Supporting: column row with vertical rules */}
					{supportingProjects.length > 0 && (
						<>
							<Rule />
							<div className="front-page__work-columns">
								{supportingProjects.map((p, i) => (
									<div key={p.slug} className="front-page__work-col rv" data-reveal-delay={0.08 + i * 0.07}>
										<ArticleCard project={p} />
									</div>
								))}
							</div>
						</>
					)}

					<div className="front-page__see-all rv" data-reveal-delay="0.15">
						<Link to="/work" className="front-page__all-link">All projects <span className="arrow">→</span></Link>
					</div>
				</div>
			</section>

			<Rule className="front-page__rule" />

			{/* ── Philosophy + Career preview ── */}
			<section className="front-page__mid" aria-label="Philosophy and career">
				<div className="container">
					<div className="front-page__mid-grid">

						<div className="front-page__philosophy">
							<h2 className="front-page__section-label rv">
								Engineering Philosophy
							</h2>
							{philosophy.slice(0, 4).map((item, i) => (
								<div key={i} className="rv" data-reveal-delay={0.05 + i * 0.07}>
									<PhilosophyItem {...item} />
								</div>
							))}
							<div className="front-page__see-all rv" data-reveal-delay="0.3">
								<Link to="/about#philosophy" className="front-page__all-link">
									Full philosophy <span className="arrow">→</span>
								</Link>
							</div>
						</div>

						<div className="front-page__career">
							<h2 className="front-page__section-label rv">
								Career Desk
							</h2>
							{experience.slice(0, 2).map((entry, i) => (
								<div key={i} className="rv" data-reveal-delay={0.05 + i * 0.07}>
									<TimelineEntry {...entry} />
								</div>
							))}
							<div className="front-page__see-all rv" data-reveal-delay="0.2">
								<Link to="/about#career" className="front-page__all-link">
									Full career desk + CV <span className="arrow">→</span>
								</Link>
							</div>
						</div>

					</div>
				</div>
			</section>

			<Rule className="front-page__rule" />

			{/* ── Field Notes + Current Focus ── */}
			<section className="front-page__bottom" aria-label="Field notes and current focus">
				<div className="container">
					<div className="front-page__notes-grid">

						<div className="front-page__notes">
							<h2 className="front-page__section-label rv">
								Field Notes
							</h2>
							{fieldNotes.slice(0, 3).map((note, i) => (
								<div key={note.slug} className="rv" data-reveal-delay={i * 0.08}>
									<FieldNoteCard note={note} />
								</div>
							))}
							<div className="front-page__see-all rv" data-reveal-delay="0.2">
								<Link to="/notes" className="front-page__all-link">
									All field notes <span className="arrow">→</span>
								</Link>
							</div>
						</div>

						{currentFocus && (
							<div className="rv" data-reveal-delay="0.1">
								<CurrentFocusBlock focus={currentFocus} />
							</div>
						)}

					</div>
				</div>
			</section>

		</div>
	);
}

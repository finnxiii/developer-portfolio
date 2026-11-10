import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useFrontPage } from "./FrontPageContext";
import { useMatchMedia } from "../../hooks/useMatchMedia";

export default function HeroSection() {
	const { data } = usePortfolioData();
	const { profile } = data;
	const { jDone, jTyping, reducedMotion } = useFrontPage();
	const isMobile = useMatchMedia("(max-width: 1199px)");

	return (
		<div className="hero-section">
			<span className="fp-label">finnxiii · Sheffield</span>
			<h1 className="fp-h1">{profile.heroHeadline}</h1>
			<p className="fp-standfirst">{profile.heroStandfirst}</p>
			<div className="fp-ctas">
				<a href="#bug" className="btn btn--solid">Find a bug ↓</a>
				<a href="#work" className="btn btn--outline">See my work</a>
				<a
					href={profile.links.cv}
					target="_blank"
					rel="noopener noreferrer"
					className="fp-cv-link"
				>
					CV ↗
				</a>
			</div>
			{isMobile && (
				<div
					className="hero-inline-jshell"
					role="img"
					aria-label="jshell session introducing Finn"
				>
					<div className="term-bar term-bar--dark">
						<i className="term-bar__dot term-bar__dot--red" />
						<i className="term-bar__dot term-bar__dot--yellow" />
						<i className="term-bar__dot term-bar__dot--green" />
						<span>jshell</span>
					</div>
					<div className="hero-inline-jshell__body">
						{jDone.map((s, i) => (
							<div key={i}>
								<div>
									<span className="hero-scene__jshell-prompt">jshell&gt;</span> {s.cmd}
								</div>
								<div className="hero-scene__jshell-out">{s.out}</div>
							</div>
						))}
						{!reducedMotion && (
							<div>
								<span className="hero-scene__jshell-prompt">jshell&gt;</span> {jTyping}
								<span className="hero-scene__cursor" aria-hidden="true">▌</span>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

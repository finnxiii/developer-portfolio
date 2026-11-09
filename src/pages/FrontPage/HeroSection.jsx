import { usePortfolioData } from "../../hooks/usePortfolioData";

export default function HeroSection() {
	const { data } = usePortfolioData();
	const { profile } = data;

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
		</div>
	);
}

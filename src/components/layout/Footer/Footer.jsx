import { usePortfolioData } from "../../../hooks/usePortfolioData";
import { useStage } from "../../stage/StageContext";
import "./Footer.scss";

export default function Footer() {
	const { data } = usePortfolioData();
	const links = data?.profile?.links ?? {};
	const cvHref = links.cv ?? "/NaingHtooLwin-CV.pdf";
	const githubHref = links.github ?? "https://github.com/finnxiii";
	const linkedinHref = links.linkedin ?? "https://linkedin.com/in/nainghtoolwin";
	const emailHref = links.email ? `mailto:${links.email}` : "mailto:nainghtoolwin1385@gmail.com";

	const { scenes, activeId } = useStage();
	const activeScene = scenes.find((s) => s.id === activeId);
	const isDark = activeScene?.dark ?? false;

	return (
		<footer className={"footer" + (isDark ? " footer--dark" : "")}>
			<p className="footer__copy">
				Tested by GitHub Actions, deployed by Cloudflare, debugged by a duck.
			</p>
			<nav className="footer__links" aria-label="Footer links">
				<a href={githubHref} className="footer__link" target="_blank" rel="noopener noreferrer">GitHub</a>
				<a href={linkedinHref} className="footer__link" target="_blank" rel="noopener noreferrer">LinkedIn</a>
				<a href={emailHref} className="footer__link">Email</a>
				<a href={cvHref} className="footer__link" target="_blank" rel="noopener noreferrer" aria-label="CV (PDF)">CV</a>
			</nav>
		</footer>
	);
}

import { Link } from "react-router-dom";
import { getLenis } from "../../../hooks/useSmoothScroll";
import { usePortfolioData } from "../../../hooks/usePortfolioData";
import "./Footer.scss";

function scrollToTop() {
	const lenis = getLenis();
	if (lenis) lenis.scrollTo(0);
	else window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function Footer() {
	const year = new Date().getFullYear();
	const { data } = usePortfolioData();
	const cvHref = data?.profile?.links?.cv ?? "/NaingHtooLwin-CV.pdf";

	return (
		<footer className="footer">
			<div className="footer__inner container">
				{/* Row 1 — compact logo + links */}
				<div className="footer__row1">
					<Link to="/" className="footer__logo" aria-label="The Build Log — Home">
						The Build Log
					</Link>
					<nav className="footer__links" aria-label="Footer links">
						<a href="mailto:nainghtoolwin1385@gmail.com" className="footer__link">Email</a>
						<span className="footer__sep" aria-hidden="true">·</span>
						<a href={cvHref} className="footer__link" target="_blank" rel="noopener noreferrer" aria-label="Open CV (PDF, new tab)">CV</a>
						<span className="footer__sep" aria-hidden="true">·</span>
						<a href="https://github.com/finnxiii" className="footer__link" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
						<span className="footer__sep" aria-hidden="true">·</span>
						<a href="https://linkedin.com/in/nainghtoolwin" className="footer__link" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
					</nav>
				</div>

				<div className="footer__divider" aria-hidden="true" />

				{/* Row 2 — copyright + back to top */}
				<div className="footer__row2">
					<p className="footer__copy">&copy; {year} Naing Htoo Lwin. All rights reserved.</p>
					<button className="footer__top" type="button" onClick={scrollToTop}>
						Back to top ↑
					</button>
				</div>
			</div>
		</footer>
	);
}

import "./Footer.scss";

export default function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="footer">
			<div className="footer__inner container">
				<div className="footer__top">
					<p className="footer__signoff">
						<span className="footer__wordmark">FINNXIII.DEV</span>
						<span className="footer__edition label-text">The Engineering Edition</span>
					</p>
					<nav className="footer__links" aria-label="Footer links">
						<a
							href="mailto:nainghtoolwin1385@gmail.com"
							className="footer__link"
						>
							Email
						</a>
						<a
							href="/cv.pdf"
							className="footer__link"
							target="_blank"
							rel="noopener noreferrer"
						>
							CV
						</a>
						<a
							href="https://github.com/finnxiii"
							className="footer__link"
							target="_blank"
							rel="noopener noreferrer"
						>
							GitHub
						</a>
						<a
							href="https://linkedin.com/in/nainghtoolwin"
							className="footer__link"
							target="_blank"
							rel="noopener noreferrer"
						>
							LinkedIn
						</a>
					</nav>
				</div>
				<div className="footer__bottom">
					<p className="footer__copy label-text">
						&copy; {year} Naing Htoo Lwin. All rights reserved.
					</p>
					<a href="#top" className="footer__back-to-top label-text">
						Back to top ↑
					</a>
				</div>
			</div>
		</footer>
	);
}

import "./UtilityBar.scss";

export default function UtilityBar() {
	return (
		<div className="utility-bar">
			<div className="utility-bar__inner container">
				<span className="utility-bar__date label-text">Updated Sep 2026</span>
				<nav className="utility-bar__links" aria-label="Utility links">
					<a
						href="/cv.pdf"
						className="utility-bar__link"
						target="_blank"
						rel="noopener noreferrer"
					>
						CV
					</a>
					<a
						href="https://github.com/finnxiii"
						className="utility-bar__link"
						target="_blank"
						rel="noopener noreferrer"
					>
						GitHub
					</a>
					<a
						href="https://linkedin.com/in/nainghtoolwin"
						className="utility-bar__link"
						target="_blank"
						rel="noopener noreferrer"
					>
						LinkedIn
					</a>
					<a
						href="mailto:nainghtoolwin1385@gmail.com"
						className="utility-bar__link"
					>
						Email
					</a>
				</nav>
			</div>
		</div>
	);
}

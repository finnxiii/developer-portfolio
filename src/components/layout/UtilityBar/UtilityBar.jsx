import { usePortfolioData } from "../../../hooks/usePortfolioData";
import ThemeToggle from "../../ui/ThemeToggle/index";
import "./UtilityBar.scss";

export default function UtilityBar() {
	const { data } = usePortfolioData();
	const editionNum = (data.meta?.editionLabel ?? "").match(/\d+/)?.[0] ?? "01";

	return (
		<div className="utility-bar" role="complementary" aria-label="Publication details">
			<div className="utility-bar__inner container">

				<div className="utility-bar__left">
					<span className="utility-bar__item">
						The Engineering Edition · No.&nbsp;{editionNum}
					</span>
				</div>

				<div className="utility-bar__right">
					<nav className="utility-bar__links" aria-label="External links">
						<a href="/cv.pdf" className="utility-bar__link" target="_blank" rel="noopener noreferrer">CV</a>
						<a href="https://github.com/finnxiii" className="utility-bar__link" target="_blank" rel="noopener noreferrer">GitHub</a>
						<a href="https://linkedin.com/in/nainghtoolwin" className="utility-bar__link" target="_blank" rel="noopener noreferrer">LinkedIn</a>
						<a href="mailto:nainghtoolwin1385@gmail.com" className="utility-bar__link">Email</a>
					</nav>
					<span className="utility-bar__sep" aria-hidden="true" />
					<ThemeToggle />
				</div>

			</div>
		</div>
	);
}

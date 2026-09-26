import { useState, useEffect } from "react";
import { usePortfolioData } from "../../../hooks/usePortfolioData";
import ThemeToggle from "../../ui/ThemeToggle/index";
import "./UtilityBar.scss";

const COMMIT = typeof __COMMIT__ !== "undefined" ? __COMMIT__ : "dev";

function formatLongDate(date) {
	return new Intl.DateTimeFormat("en-GB", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(date);
}

function useLiveClock() {
	const [date, setDate] = useState(() => new Date());
	useEffect(() => {
		const id = setInterval(() => setDate(new Date()), 60_000);
		return () => clearInterval(id);
	}, []);
	return date;
}

export default function UtilityBar() {
	const date = useLiveClock();
	const { data } = usePortfolioData();
	const editionNum = (data.meta?.editionLabel ?? "").match(/\d+/)?.[0] ?? "01";

	return (
		<div className="utility-bar" role="complementary" aria-label="Publication details">
			<div className="utility-bar__inner container">

				<div className="utility-bar__left">
					<span className="utility-bar__item">Vol.&nbsp;II · No.&nbsp;{editionNum}</span>
					<span className="utility-bar__sep utility-bar__sep--sm" aria-hidden="true" />
					<time className="utility-bar__item utility-bar__item--sm" dateTime={date.toISOString()}>
						Sheffield, {formatLongDate(date)}
					</time>
					<span className="utility-bar__sep utility-bar__sep--md" aria-hidden="true" />
					<span className="utility-bar__item utility-bar__item--md">
						Printed from commit&nbsp;<code className="utility-bar__hash">{COMMIT}</code>
					</span>
					<span className="utility-bar__sep utility-bar__sep--lg" aria-hidden="true" />
					<span className="utility-bar__item utility-bar__item--lg">
						Price: free · No cookies
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

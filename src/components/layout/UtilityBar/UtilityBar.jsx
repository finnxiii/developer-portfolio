import { useState, useEffect } from "react";
import ThemeToggle from "../../ui/ThemeToggle/index";
import { usePortfolioData } from "../../../hooks/usePortfolioData";
import "./UtilityBar.scss";

const TZ = "Europe/London";

function formatClock(date) {
	const o = { timeZone: TZ };
	const time = new Intl.DateTimeFormat("en-GB", {
		...o, hour: "2-digit", minute: "2-digit", hour12: false,
	}).format(date);

	const weekdayLong = new Intl.DateTimeFormat("en-GB", { ...o, weekday: "long" }).format(date);
	const weekdayShort = new Intl.DateTimeFormat("en-GB", { ...o, weekday: "short" }).format(date);
	const day = new Intl.DateTimeFormat("en-GB", { ...o, day: "numeric" }).format(date);
	const monthLong = new Intl.DateTimeFormat("en-GB", { ...o, month: "long" }).format(date);
	const monthShort = new Intl.DateTimeFormat("en-GB", { ...o, month: "short" }).format(date);
	const year = new Intl.DateTimeFormat("en-GB", { ...o, year: "numeric" }).format(date);

	return {
		long: `${weekdayLong} ${day} ${monthLong} ${year}`,
		mid: `${weekdayShort} ${day} ${monthShort} ${year}`,
		short: `${day} ${monthShort}`,
		time,
		iso: date.toISOString(),
	};
}

function useLiveClock() {
	const [now, setNow] = useState(() => new Date());

	useEffect(() => {
		let interval;
		const tick = () => setNow(new Date());
		const d = new Date();
		const msToNext = (60 - d.getSeconds()) * 1000 - d.getMilliseconds();
		const timeout = setTimeout(() => {
			tick();
			interval = setInterval(tick, 60_000);
		}, msToNext);
		return () => {
			clearTimeout(timeout);
			if (interval) clearInterval(interval);
		};
	}, []);

	return now;
}

export default function UtilityBar() {
	const now = useLiveClock();
	const { long, mid, short, time, iso } = formatClock(now);
	const { data } = usePortfolioData();
	const cvHref = data?.profile?.links?.cv ?? "/NaingHtooLwin-CV.pdf";

	return (
		<div className="utility-bar" role="complementary" aria-label="Publication details">
			<div className="utility-bar__inner container">

				<div className="utility-bar__left">
					<time className="utility-bar__clock" dateTime={iso}>
						<span className="utility-bar__datestamp utility-bar__datestamp--long">
							<span className="utility-bar__date">{long}</span>
							{" · "}
							<span className="utility-bar__time">{time}</span>
						</span>
						<span className="utility-bar__datestamp utility-bar__datestamp--mid">
							<span className="utility-bar__date">{mid}</span>
							{" · "}
							<span className="utility-bar__time">{time}</span>
						</span>
						<span className="utility-bar__datestamp utility-bar__datestamp--short">
							<span className="utility-bar__date">{short}</span>
							{" · "}
							<span className="utility-bar__time">{time}</span>
						</span>
					</time>
				</div>

				<div className="utility-bar__right">
					<nav className="utility-bar__links" aria-label="External links">
						<a href={cvHref} className="utility-bar__link" target="_blank" rel="noopener noreferrer" aria-label="Open CV (PDF, new tab)">CV</a>
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

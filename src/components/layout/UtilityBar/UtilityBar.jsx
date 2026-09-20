import { useState, useEffect } from "react";
import ThemeToggle from "../../ui/ThemeToggle/index";
import "./UtilityBar.scss";

function formatMobile(date) {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(date);
}

function formatTablet(date) {
	return new Intl.DateTimeFormat("en-US", {
		weekday: "long",
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(date);
}

function formatDesktop(date) {
	const part = new Intl.DateTimeFormat("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
	}).format(date);
	const time = new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	}).format(date);
	return `${part} · ${time}`;
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

	return (
		<div className="utility-bar">
			<div className="utility-bar__inner container">
				<time className="utility-bar__date" dateTime={date.toISOString()}>
					<span className="utility-bar__date--mobile">{formatMobile(date)}</span>
					<span className="utility-bar__date--tablet">{formatTablet(date)}</span>
					<span className="utility-bar__date--desktop">{formatDesktop(date)}</span>
				</time>
				<div className="utility-bar__right">
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
					<span className="utility-bar__divider" aria-hidden="true" />
					<ThemeToggle />
				</div>
			</div>
		</div>
	);
}

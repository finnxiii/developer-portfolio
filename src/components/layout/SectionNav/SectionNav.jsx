import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import "./SectionNav.scss";

const NAV_ITEMS = [
	{ to: "/",      label: "Front Page",    prefix: "§1", end: true },
	{ to: "/work",  label: "Selected Work", prefix: "§2" },
	{ to: "/about", label: "The Engineer",  prefix: "§3" },
	{ to: "/notes", label: "Field Notes",   prefix: "§4" },
	{ to: "/now",   label: "Now",           prefix: "§5" },
];

export default function SectionNav() {
	// Lazy initializer: if there's no masthead on this page, show the wordmark immediately.
	// IntersectionObserver then takes over for pages that do have one.
	const [pastMasthead, setPastMasthead] = useState(
		() => !document.querySelector(".masthead")
	);

	useEffect(() => {
		const masthead = document.querySelector(".masthead");
		if (!masthead) return; // already initialised to true above

		const observer = new IntersectionObserver(
			([entry]) => setPastMasthead(!entry.isIntersecting),
			{ threshold: 0 }
		);

		observer.observe(masthead);
		return () => observer.disconnect();
	}, []);

	return (
		<nav
			className={`section-nav${pastMasthead ? " section-nav--stuck" : ""}`}
			aria-label="Section navigation"
		>
			<div className="section-nav__inner container">

				{/* Column 1 — compact wordmark, always in DOM, animates in */}
				<Link
					to="/"
					className={`section-nav__compact-wordmark${pastMasthead ? " is-visible" : ""}`}
					aria-hidden={pastMasthead ? undefined : "true"}
					tabIndex={pastMasthead ? undefined : -1}
					aria-label="FINNXIII.DEV — Home"
				>
					FINNXIII.DEV
				</Link>

				{/* Column 2 — nav list, always centred */}
				<ul className="section-nav__list" role="list">
					{NAV_ITEMS.map(({ to, label, prefix, end }) => (
						<li key={to} className="section-nav__item">
							<NavLink
								to={to}
								end={end}
								className={({ isActive }) =>
									`section-nav__link${isActive ? " section-nav__link--active" : ""}`
								}
							>
								<span className="section-nav__prefix" aria-hidden="true">{prefix}</span>
								{" "}{label}
							</NavLink>
						</li>
					))}
				</ul>

				{/* Column 3 — invisible spacer, mirrors column 1 to keep list centred */}
				<div className="section-nav__spacer" aria-hidden="true" />

			</div>
		</nav>
	);
}

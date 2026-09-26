import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import "./SectionNav.scss";

const NAV_ITEMS = [
	{ to: "/",      label: "Front Page",   prefix: "§1", end: true },
	{ to: "/work",  label: "Selected Work",prefix: "§2" },
	{ to: "/about", label: "The Engineer", prefix: "§3" },
	{ to: "/notes", label: "Field Notes",  prefix: "§4" },
	{ to: "/now",   label: "Now",          prefix: "§5" },
];

export default function SectionNav() {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 120);
		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<nav className="section-nav" aria-label="Section navigation">
			<div className="section-nav__inner container">
				{scrolled && (
					<Link to="/" className="section-nav__compact-wordmark" aria-label="FINNXIII.DEV — Home">
						FINNXIII.DEV
					</Link>
				)}
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
			</div>
		</nav>
	);
}

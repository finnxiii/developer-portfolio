import { NavLink } from "react-router-dom";
import "./SectionNav.scss";

const NAV_ITEMS = [
	{ to: "/", label: "Front Page", end: true },
	{ to: "/work", label: "Selected Work" },
	{ to: "/about", label: "The Engineer" },
	{ to: "/notes", label: "Field Notes" },
	{ to: "/now", label: "Now" },
];

export default function SectionNav() {
	return (
		<nav className="section-nav" aria-label="Section navigation">
			<div className="section-nav__inner container">
				<ul className="section-nav__list" role="list">
					{NAV_ITEMS.map(({ to, label, end }) => (
						<li key={to} className="section-nav__item">
							<NavLink
								to={to}
								end={end}
								className={({ isActive }) =>
									`section-nav__link${isActive ? " section-nav__link--active" : ""}`
								}
							>
								{label}
							</NavLink>
						</li>
					))}
				</ul>
			</div>
		</nav>
	);
}

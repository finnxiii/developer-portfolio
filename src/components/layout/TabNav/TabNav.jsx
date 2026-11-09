import { useRef, useEffect, useState, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./TabNav.scss";

const BASE_TABS = [
	{ label: "Finn.java",  to: "/" },
	{ label: "Work.java",  to: "/work" },
	{ label: "About.java", to: "/about" },
	{ label: "notes/",     to: "/notes" },
	{ label: "Now.log",    to: "/now" },
];

export default function TabNav({ extraTab }) {
	const location = useLocation();
	const navRef = useRef(null);
	const activeTabRef = useRef(null);
	const [fadeState, setFadeState] = useState({ left: false, right: false });

	const insertPos = extraTab?.to?.startsWith("/notes/") ? 4 : 2;
	const tabs = extraTab
		? [...BASE_TABS.slice(0, insertPos), extraTab, ...BASE_TABS.slice(insertPos)]
		: BASE_TABS;

	// Recompute which fade edges are needed
	const updateFades = useCallback(() => {
		const nav = navRef.current;
		if (!nav) return;
		const { scrollLeft, scrollWidth, clientWidth } = nav;
		setFadeState({
			left: scrollLeft > 0,
			right: scrollLeft + clientWidth < scrollWidth - 1,
		});
	}, []);

	// Watch scroll and size changes on the tab strip
	useEffect(() => {
		const nav = navRef.current;
		if (!nav) return;
		updateFades();
		nav.addEventListener("scroll", updateFades, { passive: true });
		const ro = new ResizeObserver(updateFades);
		ro.observe(nav);
		return () => {
			nav.removeEventListener("scroll", updateFades);
			ro.disconnect();
		};
	}, [updateFades]);

	// Scroll active tab into view on route change
	useEffect(() => {
		if (activeTabRef.current) {
			activeTabRef.current.scrollIntoView({
				block: "nearest",
				inline: "nearest",
			});
		}
	}, [location.pathname]);

	// Callback ref to capture the active NavLink element
	const setActiveRef = useCallback((el) => {
		activeTabRef.current = el;
	}, []);

	const fadeAttr =
		fadeState.left && fadeState.right ? "both"
		: fadeState.left  ? "left"
		: fadeState.right ? "right"
		: "none";

	return (
		<nav
			ref={navRef}
			className="tab-nav"
			data-fade={fadeAttr}
			aria-label="Pages"
		>
			{tabs.map(({ label, to }) => {
				const isActive = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
				return (
					<NavLink
						key={to}
						ref={isActive ? setActiveRef : undefined}
						to={to}
						className={({ isActive: navActive }) =>
							"tab-nav__tab" + (navActive || isActive ? " tab-nav__tab--active" : "")
						}
						end={to === "/"}
						aria-current={isActive ? "page" : undefined}
					>
						{label}
					</NavLink>
				);
			})}
		</nav>
	);
}

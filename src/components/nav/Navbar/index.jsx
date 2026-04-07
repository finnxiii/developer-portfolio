import { useEffect, useState } from "react";
import ThemeToggle from "../../ui/ThemeToggle";
import "./Navbar.scss";

export default function Navbar() {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 40);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
			<div className="navbar__inner">
				<span className="navbar__logo">
					finnxiii<span className="navbar__logo-dot">.</span>
				</span>
				<ThemeToggle />
			</div>
		</header>
	);
}

import { useRef, useLayoutEffect, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import gsap from "gsap";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import SkipToContent from "../SkipToContent/SkipToContent";
import UtilityBar from "../UtilityBar/UtilityBar";
import Masthead from "../Masthead/Masthead";
import SectionNav from "../SectionNav/SectionNav";
import Footer from "../Footer/Footer";
import "./PageLayout.scss";

export default function PageLayout() {
	const mainRef = useRef(null);
	const location = useLocation();
	const prefersReduced = useReducedMotion();

	// Before browser paint: hide incoming content and scroll to top
	useLayoutEffect(() => {
		window.scrollTo({ top: 0, left: 0, behavior: "instant" });
		if (!prefersReduced) {
			gsap.set(mainRef.current, { opacity: 0, y: 15 });
		}
	}, [location.key]);

	// After browser paint: animate content in
	useEffect(() => {
		if (prefersReduced) return;
		const ctx = gsap.context(() => {
			gsap.to(mainRef.current, {
				opacity: 1,
				y: 0,
				duration: 0.4,
				ease: "power2.out",
				clearProps: "opacity,transform",
			});
		});
		return () => ctx.revert();
	}, [location.key]);

	return (
		<div className="page-layout" id="top">
			<SkipToContent />
			<UtilityBar />
			<Masthead />
			<SectionNav />
			<main ref={mainRef} id="main-content" className="page-layout__main">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}

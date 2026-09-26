import { useRef, useLayoutEffect, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import { getLenis } from "../../../hooks/useSmoothScroll";
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

	// Before browser paint: scroll to top (or preserve position for hash nav) and hide incoming content
	useLayoutEffect(() => {
		const lenis = getLenis();
		if (!location.hash) {
			if (lenis) {
				lenis.scrollTo(0, { immediate: true });
			} else {
				window.scrollTo({ top: 0, left: 0, behavior: "instant" });
			}
		}
		if (!prefersReduced) {
			gsap.set(mainRef.current, { opacity: 0, y: 15 });
		}
	}, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

	// After browser paint: animate content in then refresh ScrollTrigger positions
	useEffect(() => {
		if (prefersReduced) return;
		const hash = location.hash;
		const ctx = gsap.context(() => {
			gsap.to(mainRef.current, {
				opacity: 1,
				y: 0,
				duration: 0.4,
				ease: "power2.out",
				clearProps: "opacity,transform",
				onComplete: () => {
					ScrollTrigger.refresh();
					if (hash) {
						const target = document.querySelector(hash);
						if (target) {
							const lenis = getLenis();
							if (lenis) lenis.scrollTo(target, { offset: -64 });
							else target.scrollIntoView({ behavior: "smooth" });
						}
					}
				},
			});
		});
		return () => ctx.revert();
	}, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

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

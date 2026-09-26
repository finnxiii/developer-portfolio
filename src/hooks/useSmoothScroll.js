import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Module-level singleton — one Lenis instance across the app
let _lenis = null;

export function getLenis() {
	return _lenis;
}

// Offset accounts for the sticky section-nav height
const ANCHOR_OFFSET = -64;

export function useSmoothScroll(prefersReduced) {
	useEffect(() => {
		if (prefersReduced) {
			_lenis = null;
			return;
		}

		const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
		_lenis = lenis;

		lenis.on("scroll", ScrollTrigger.update);

		const rafFn = (t) => lenis.raf(t * 1000);
		gsap.ticker.add(rafFn);
		gsap.ticker.lagSmoothing(0);

		function handleAnchorClick(e) {
			const anchor = e.target.closest('a[href^="#"], a[href*="/#"]');
			if (!anchor) return;
			let href = anchor.getAttribute("href");
			// Normalize "/<path>#<id>" → "#<id>" when already on that pathname
			if (href.includes("#") && !href.startsWith("#")) {
				const hashIdx = href.indexOf("#");
				const pathname = href.slice(0, hashIdx);
				if (pathname === window.location.pathname || pathname === "") {
					href = href.slice(hashIdx);
				} else {
					return; // different page — let React Router handle it
				}
			}
			const target = document.querySelector(href);
			if (!target) return;
			e.preventDefault();
			lenis.scrollTo(target, { offset: ANCHOR_OFFSET });
		}

		document.addEventListener("click", handleAnchorClick);

		return () => {
			document.removeEventListener("click", handleAnchorClick);
			gsap.ticker.remove(rafFn);
			lenis.destroy();
			_lenis = null;
		};
	}, [prefersReduced]);
}

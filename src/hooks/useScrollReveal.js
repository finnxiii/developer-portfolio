import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useReducedMotion } from "./useReducedMotion";

gsap.registerPlugin(ScrollTrigger, SplitText);

// Extract the last numeric group from a string, e.g. "0–100" → prefix "0–", target 100
function parseNumericValue(text) {
	const match = text.match(/^(.*\D|)(\d+)(\D*)$/);
	if (!match) return null;
	return { prefix: match[1], target: parseInt(match[2], 10), suffix: match[3] };
}

// Path/rect stroke length for SVG draw-in
function getStrokeLength(el) {
	try {
		if (typeof el.getTotalLength === "function") return el.getTotalLength();
	} catch { /* element doesn't support getTotalLength */ }
	if (el.tagName === "rect") {
		return 2 * (parseFloat(el.getAttribute("width") || 0) + parseFloat(el.getAttribute("height") || 0));
	}
	return 0;
}

export function useScrollReveal(containerRef) {
	const prefersReduced = useReducedMotion();

	useGSAP(
		() => {
			const scope = containerRef?.current;
			if (!scope) return;

			// ── Reduced motion: show everything immediately ───────────
			if (prefersReduced) {
				gsap.set(gsap.utils.toArray(".rv", scope), { clearProps: "opacity,y,transform" });
				return;
			}

			const cleanups = [];

			// ── 1. SplitText line reveals — h1 and h2 ─────────────────
			const headlines = gsap.utils.toArray("h1, h2", scope).filter((el) => {
				// Only substantial display/editorial headings (≥ 24px)
				return parseFloat(window.getComputedStyle(el).fontSize) >= 24;
			});

			headlines.forEach((el) => {
				let split;
				try {
					split = new SplitText(el, { type: "lines", mask: "lines" });
				} catch {
					return;
				}
				// Pad masks so descenders/ascenders aren't clipped
				gsap.set(split.masks, { paddingBottom: "0.18em", marginBottom: "-0.18em" });
				gsap.set(split.lines, { yPercent: 100 });

				const trigger = ScrollTrigger.create({
					trigger: el,
					start: "top 85%",
					once: true,
					onEnter: () => {
						gsap.to(split.lines, {
							yPercent: 0,
							stagger: 0.08,
							duration: 0.9,
							ease: "expo.out",
							onComplete: () => split.revert(),
						});
					},
				});

				cleanups.push(() => {
					trigger.kill();
					split.revert();
				});
			});

			// ── 2. Rule scaleX reveals ─────────────────────────────────
			const ruleEls = gsap.utils.toArray(
				".masthead__rule, .fp-work__rule, .rule",
				scope
			);

			ruleEls.forEach((el) => {
				gsap.set(el, { scaleX: 0, transformOrigin: "left center" });

				const trigger = ScrollTrigger.create({
					trigger: el,
					start: "top 92%",
					once: true,
					onEnter: () => {
						gsap.to(el, { scaleX: 1, duration: 0.8, ease: "power3.inOut" });
					},
				});

				cleanups.push(() => trigger.kill());
			});

			// ── 3. SVG figure draw-in ──────────────────────────────────
			const figureEls = gsap.utils.toArray(
				".project-figure:not(.project-figure--compact)",
				scope
			);

			figureEls.forEach((figureEl) => {
				const svgEl = figureEl.querySelector("svg");
				if (!svgEl) return;

				// Solid stroke elements only (skip pre-dashed and <defs>/<marker> contents)
				const strokes = [
					...svgEl.querySelectorAll(
						"path:not([stroke-dasharray]), rect:not([stroke-dasharray])"
					),
				].filter((el) => !el.closest("marker") && !el.closest("defs"));

				const texts = [...svgEl.querySelectorAll("text")];

				if (!strokes.length) return;

				// Measure and hide all stroke elements
				const measured = strokes.map((el) => {
					const len = getStrokeLength(el);
					if (len > 0) {
						gsap.set(el, {
							attr: { "stroke-dasharray": len, "stroke-dashoffset": len },
						});
					}
					return { el, len };
				}).filter((item) => item.len > 0);

				gsap.set(texts, { opacity: 0 });

				const trigger = ScrollTrigger.create({
					trigger: figureEl,
					start: "top 80%",
					once: true,
					onEnter: () => {
						const tl = gsap.timeline();
						tl.to(
							measured.map((m) => m.el),
							{
								attr: { "stroke-dashoffset": 0 },
								stagger: 0.03,
								duration: 0.6,
								ease: "power2.out",
							}
						);
						if (texts.length) {
							tl.to(
								texts,
								{ opacity: 1, stagger: 0.02, duration: 0.3, ease: "power2.out" },
								"-=0.2"
							);
						}
					},
				});

				cleanups.push(() => trigger.kill());
			});

			// ── 4. Number count-up (.case-study__number-val) ──────────
			const numberVals = gsap.utils.toArray(".case-study__number-val", scope);

			numberVals.forEach((el) => {
				const raw = el.textContent.trim();
				const parsed = parseNumericValue(raw);
				if (!parsed || parsed.target === 0) return;

				const obj = { val: 0 };

				const trigger = ScrollTrigger.create({
					trigger: el,
					start: "top 85%",
					once: true,
					onEnter: () => {
						gsap.to(obj, {
							val: parsed.target,
							duration: 1.2,
							ease: "power2.out",
							snap: { val: 1 },
							onUpdate() {
								el.textContent = `${parsed.prefix}${obj.val}${parsed.suffix}`;
							},
						});
					},
				});

				cleanups.push(() => trigger.kill());
			});

			// ── 5. Card / body block reveals — .rv ────────────────────
			const headlineSet = new Set(headlines);
			const allRv = gsap.utils.toArray(".rv", scope);

			allRv.forEach((el) => {
				// Headlines handled above; don't double-animate them
				if (headlineSet.has(el)) return;

				const delay = parseFloat(el.dataset.revealDelay || "0");
				gsap.set(el, { opacity: 0, y: 24 });

				const trigger = ScrollTrigger.create({
					trigger: el,
					start: "top 88%",
					once: true,
					onEnter: () => {
						gsap.to(el, {
							opacity: 1,
							y: 0,
							duration: 0.6,
							delay,
							ease: "power2.out",
						});
					},
				});

				cleanups.push(() => trigger.kill());
			});

			return () => cleanups.forEach((fn) => fn());
		},
		{ scope: containerRef, dependencies: [prefersReduced] }
	);
}

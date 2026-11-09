import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useStage } from "./StageContext";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import Scene from "./Scene";
import "./stage.scss";

export default function StageSection({ id, fn, ln, bg, dark = false, scene, children }) {
	const { registerScene, unregisterScene, activateScene, activeId, scenes, stageNode } = useStage();
	const sectionRef = useRef(null);
	const innerRef = useRef(null);
	const prefersReduced = useReducedMotion();
	const [alignTop, setAlignTop] = useState(false);

	// Register metadata only (no scene JSX) on mount/unmount
	useEffect(() => {
		registerScene({ id, fn, ln, bg, dark });
		return () => unregisterScene(id);
	}, [id, fn, ln, bg, dark, registerScene, unregisterScene]);

	// Activate on scroll via IntersectionObserver
	useEffect(() => {
		const el = sectionRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			(entries) => entries.forEach((entry) => {
				if (entry.isIntersecting) activateScene(id);
			}),
			{ rootMargin: "-50% 0px -50% 0px" }
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [id, activateScene]);

	// Scroll into view if page loaded with matching hash
	useEffect(() => {
		const hash = window.location.hash.slice(1);
		if (hash !== id) return;
		const timer = setTimeout(() => {
			sectionRef.current?.scrollIntoView({ block: "start" });
		}, 50);
		return () => clearTimeout(timer);
	}, [id]);

	// Switch to top-align when inner content exceeds 80% of viewport height
	useEffect(() => {
		const inner = innerRef.current;
		if (!inner) return;
		const check = () => setAlignTop(inner.offsetHeight > window.innerHeight * 0.8);
		const ro = new ResizeObserver(check);
		ro.observe(inner);
		return () => ro.disconnect();
	}, []);

	const isActive = activeId === id;
	const sceneIdx = scenes.findIndex((s) => s.id === id);
	const activeIdx = scenes.findIndex((s) => s.id === activeId);
	const isAbove = sceneIdx < activeIdx;

	const revealStyle = prefersReduced
		? {}
		: {
			opacity: isActive ? 1 : 0.12,
			transform: isActive ? "none" : `translateY(${isAbove ? "-28px" : "36px"})`,
		};

	return (
		<section
			ref={sectionRef}
			id={id}
			data-scene={id}
			className={"stage-section" + (alignTop ? " stage-section--top-align" : "")}
		>
			{stageNode && scene && createPortal(
				<Scene id={id}>{scene}</Scene>,
				stageNode
			)}
			<div ref={innerRef} className="stage-section__inner inner" style={revealStyle}>
				{children}
			</div>
		</section>
	);
}

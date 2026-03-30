import { useRef } from "react";
import { useScroll, useTransform, useSpring } from "framer-motion";

import ScrollAwareNavbar from "./components/layout/ScrollAwareNavbar";
import Hero from "./sections/Hero";
import Transition from "./sections/Transition";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";

function App() {
	const transitionRef = useRef(null);

	const { scrollY, scrollYProgress } = useScroll({
		target: transitionRef,
		offset: ["start start", "end end"],
	});

	const progress = useSpring(scrollYProgress, {
		stiffness: 52,
		damping: 24,
		mass: 1,
	});

	const heroOpacity = useTransform(progress, [0, 0.8, 0.93, 1], [1, 1, 0.22, 0]);

	const fogOpacity = useTransform(progress, [0, 0.06, 0.22, 0.5, 0.78, 1], [0, 0.02, 0.08, 0.24, 0.62, 1]);

	const lowerFogOpacity = useTransform(progress, [0, 0.1, 0.28, 0.56, 0.82, 1], [0, 0.04, 0.14, 0.34, 0.76, 1]);

	return (
		<main className="bg-[var(--about-bg)] text-white">
			<ScrollAwareNavbar scrollY={scrollY} />

			<Hero heroOpacity={heroOpacity} />

			<div className="relative z-10">
				<div id="top" className="h-screen" />

				<div ref={transitionRef}>
					<Transition fogOpacity={fogOpacity} lowerFogOpacity={lowerFogOpacity} progress={progress} />
				</div>

				<div className="relative z-20 bg-[var(--about-bg)] text-[var(--about-text)]">
					<About />
					<Skills />
					<Projects />
					<Contact />
				</div>
			</div>
		</main>
	);
}

export default App;

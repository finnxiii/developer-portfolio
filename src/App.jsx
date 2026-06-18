import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Cursor from "./components/ui/Cursor";
import Navbar from "./components/nav/Navbar";
import Sidebar from "./components/nav/Sidebar";
import Footer from "./components/ui/Footer";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";
import { useScrollReveal } from "./hooks/useScrollReveal";
import "./App.scss";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
	// Lenis smooth scroll synced with GSAP ticker
	useEffect(() => {
		const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });

		lenis.on("scroll", ScrollTrigger.update);

		const tick = (time) => lenis.raf(time * 1000);
		gsap.ticker.add(tick);
		gsap.ticker.lagSmoothing(0);

		return () => {
			lenis.destroy();
			gsap.ticker.remove(tick);
		};
	}, []);

	// Central GSAP ScrollTrigger-based reveal for all .rv elements
	useScrollReveal();

	return (
		<>
			<Cursor />
			<Navbar />
			<Sidebar />
			<main>
				<Hero />
				<About />
				<Skills />
				<Projects />
				<Contact />
				<Footer />
			</main>
		</>
	);
}

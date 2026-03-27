import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";

export default function App() {
	return (
		<main className="bg-neutral-950 text-white">
			<Hero />
			<About />
			<Skills />
			<Projects />
			<Contact />
		</main>
	);
}

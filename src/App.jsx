import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";

const App = () => {
	return (
		<main className="bg-neutral-950 text-white">
			<Navbar />
			<Hero />
			<About />
			<Skills />
			<Projects />
			<Contact />
		</main>
	);
};

export default App;

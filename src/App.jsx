import Sidebar from "./components/nav/Sidebar";
import Signature from "./components/ui/Signature";
import ThemeToggle from "./components/ui/ThemeToggle";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";
import "./App.css";

export default function App() {
	return (
		<>
			<Signature />
			<Sidebar />
			<ThemeToggle />
			<main>
				<Hero />
				<About />
				<Skills />
				<Projects />
				<Contact />
				<footer className="footer">
					<span className="ft">© {new Date().getFullYear()} finnxiii. All rights reserved.</span>
					<span className="ft">Built with React + Vite</span>
				</footer>
			</main>
		</>
	);
}

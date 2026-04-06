import Cursor from "./components/ui/Cursor";
import Navbar from "./components/nav/Navbar";
import Sidebar from "./components/nav/Sidebar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";
import "./App.css";

export default function App() {
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
				<footer className="footer">
					<span className="ft">© 2025 finnxiii</span>
					<span className="ft">Built with React + Vite</span>
				</footer>
			</main>
		</>
	);
}

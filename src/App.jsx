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
			<Navbar />
			<Sidebar />
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

import Cursor from "./components/ui/Cursor";
import Navbar from "./components/nav/Navbar";
import Sidebar from "./components/nav/Sidebar";
import Footer from "./components/ui/Footer";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";
import "./App.scss";

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
				<Footer />
			</main>
		</>
	);
}

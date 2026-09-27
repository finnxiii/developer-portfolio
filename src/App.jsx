import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import PageLayout from "./components/layout/PageLayout/PageLayout";
import FrontPage from "./pages/FrontPage/FrontPage";
import SelectedWork from "./pages/SelectedWork/SelectedWork";
import CaseStudy from "./pages/CaseStudy/CaseStudy";
import TheEngineer from "./pages/TheEngineer/TheEngineer";
import FieldNotes from "./pages/FieldNotes/FieldNotes";
import FieldNote from "./pages/FieldNote/FieldNote";
import CurrentFocusPage from "./pages/CurrentFocusPage/CurrentFocusPage";
import AdminLogin from "./pages/Admin/Login";
import AdminDashboard from "./pages/Admin/Dashboard";

gsap.registerPlugin(ScrollTrigger, SplitText);

const USE_KV = import.meta.env.VITE_USE_KV === "true";

export default function App() {
	const prefersReduced = useReducedMotion();
	useSmoothScroll(prefersReduced);

	return (
		<BrowserRouter>
			<Routes>
				{/* Admin — only registered when KV backend is enabled */}
				{USE_KV && <Route path="/admin" element={<AdminLogin />} />}
				{USE_KV && <Route path="/admin/dashboard" element={<AdminDashboard />} />}

				{/* Public — all wrapped in PageLayout */}
				<Route element={<PageLayout />}>
					<Route path="/" element={<FrontPage />} />
					<Route path="/work" element={<SelectedWork />} />
					<Route path="/work/:slug" element={<CaseStudy />} />
					<Route path="/about" element={<TheEngineer />} />
					<Route path="/philosophy" element={<Navigate to="/about#how-i-work" replace />} />
					<Route path="/career" element={<Navigate to="/about#experience" replace />} />
					<Route path="/notes" element={<FieldNotes />} />
					<Route path="/notes/:slug" element={<FieldNote />} />
					<Route path="/now" element={<CurrentFocusPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

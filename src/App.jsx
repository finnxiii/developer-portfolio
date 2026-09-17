import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PageLayout from "./components/layout/PageLayout/PageLayout";
import FrontPage from "./pages/FrontPage/FrontPage";
import SelectedWork from "./pages/SelectedWork/SelectedWork";
import CaseStudy from "./pages/CaseStudy/CaseStudy";
import TheEngineer from "./pages/TheEngineer/TheEngineer";
import Philosophy from "./pages/Philosophy/Philosophy";
import CareerDesk from "./pages/CareerDesk/CareerDesk";
import FieldNotes from "./pages/FieldNotes/FieldNotes";
import FieldNote from "./pages/FieldNote/FieldNote";
import CurrentFocusPage from "./pages/CurrentFocusPage/CurrentFocusPage";
import AdminLogin from "./pages/Admin/Login";
import AdminDashboard from "./pages/Admin/Dashboard";

gsap.registerPlugin(ScrollTrigger);

// Resets scroll position to top on every route change
function ScrollToTop() {
	const { pathname } = useLocation();
	useEffect(() => {
		window.scrollTo({ top: 0, left: 0, behavior: "instant" });
	}, [pathname]);
	return null;
}

export default function App() {
	return (
		<BrowserRouter>
			<ScrollToTop />
			<Routes>
				{/* Admin — standalone, no editorial layout */}
				<Route path="/admin" element={<AdminLogin />} />
				<Route path="/admin/dashboard" element={<AdminDashboard />} />

				{/* Public — all wrapped in PageLayout */}
				<Route element={<PageLayout />}>
					<Route path="/" element={<FrontPage />} />
					<Route path="/work" element={<SelectedWork />} />
					<Route path="/work/:slug" element={<CaseStudy />} />
					<Route path="/about" element={<TheEngineer />} />
					<Route path="/philosophy" element={<Philosophy />} />
					<Route path="/career" element={<CareerDesk />} />
					<Route path="/notes" element={<FieldNotes />} />
					<Route path="/notes/:slug" element={<FieldNote />} />
					<Route path="/now" element={<CurrentFocusPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

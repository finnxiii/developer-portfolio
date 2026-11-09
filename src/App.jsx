import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PageLayout from "./components/layout/PageLayout/PageLayout";
import FrontPage from "./pages/FrontPage/FrontPage";

// These pages exist but are not fully wired to the stage system yet — they
// still render without it and will be rebuilt in later phases.
import SelectedWork from "./pages/SelectedWork/SelectedWork";
import CaseStudy from "./pages/CaseStudy/CaseStudy";
import TheEngineer from "./pages/TheEngineer/TheEngineer";
import FieldNotes from "./pages/FieldNotes/FieldNotes";
import FieldNote from "./pages/FieldNote/FieldNote";
import CurrentFocusPage from "./pages/CurrentFocusPage/CurrentFocusPage";

const Admin = lazy(() => import("./pages/Admin/AdminRouter"));

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/admin/*"
					element={
						<Suspense fallback={null}>
							<Admin />
						</Suspense>
					}
				/>

				<Route element={<PageLayout />}>
					<Route path="/" element={<FrontPage />} />
					<Route path="/work" element={<SelectedWork />} />
					<Route path="/work/:slug" element={<CaseStudy />} />
					<Route path="/about" element={<TheEngineer />} />
					<Route path="/philosophy" element={<Navigate to="/about" replace />} />
					<Route path="/career" element={<Navigate to="/about" replace />} />
					<Route path="/notes" element={<FieldNotes />} />
					<Route path="/notes/:slug" element={<FieldNote />} />
					<Route path="/now" element={<CurrentFocusPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

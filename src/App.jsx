import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import PageLayout from "./components/layout/PageLayout/PageLayout";
import FrontPage from "./pages/FrontPage/FrontPage";
import SEOHead from "./components/ui/SEOHead/SEOHead";
import StageSection from "./components/stage/StageSection";

// These pages exist but are not fully wired to the stage system yet — they
// still render without it and will be rebuilt in later phases.
import SelectedWork from "./pages/SelectedWork/SelectedWork";
import CaseStudy from "./pages/CaseStudy/CaseStudy";
import TheEngineer from "./pages/TheEngineer/TheEngineer";
import FieldNotes from "./pages/FieldNotes/FieldNotes";
import FieldNote from "./pages/FieldNote/FieldNote";
import CurrentFocusPage from "./pages/CurrentFocusPage/CurrentFocusPage";

const Admin = lazy(() => import("./pages/Admin/AdminRouter"));

function NotFoundScene() {
	return (
		<div
			style={{
				position: "absolute", inset: 0,
				backgroundImage: "radial-gradient(#D2CABB 1.3px, transparent 1.3px)",
				backgroundSize: "24px 24px",
			}}
		/>
	);
}

function NotFound() {
	return (
		<>
			<SEOHead title="Page not found" raw />
			<StageSection id="notfound" fn="main()" ln="01" bg="var(--paper)" dark={false} scene={<NotFoundScene />}>
				<div style={{ maxWidth: "600px" }}>
					<span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--muted)" }}>
						Exception in thread &quot;main&quot;
					</span>
					<h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 68px)", fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1, margin: "12px 0 24px" }}>
						ClassNotFoundException
					</h1>
					<p style={{ fontFamily: "var(--font-body)", fontSize: "19px", lineHeight: 1.7, color: "var(--ink-2)", marginBottom: "32px" }}>
						There&apos;s no page at <code style={{ fontFamily: "var(--font-mono)", fontSize: "16px" }}>{window.location.pathname}</code>.
					</p>
					<div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
						<Link to="/" className="btn btn--solid">Finn.java</Link>
						<Link to="/work" className="btn btn--outline">Work.java</Link>
					</div>
				</div>
			</StageSection>
		</>
	);
}

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
				<Route path="*" element={<NotFound />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

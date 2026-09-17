import { Outlet } from "react-router-dom";
import SkipToContent from "../SkipToContent/SkipToContent";
import UtilityBar from "../UtilityBar/UtilityBar";
import Masthead from "../Masthead/Masthead";
import SectionNav from "../SectionNav/SectionNav";
import Footer from "../Footer/Footer";
import "./PageLayout.scss";

export default function PageLayout() {
	return (
		<div className="page-layout" id="top">
			<SkipToContent />
			<UtilityBar />
			<Masthead />
			<SectionNav />
			<main id="main-content" className="page-layout__main">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}

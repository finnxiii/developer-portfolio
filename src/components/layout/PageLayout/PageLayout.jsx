import { Component, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { StageProvider } from "../../stage/StageContext";
import Stage from "../../stage/Stage";
import Chrome from "../Chrome/Chrome";
import { ChromeProvider } from "../Chrome/ChromeContext";
import SectionPill from "../SectionPill/SectionPill";
import SkipToContent from "../SkipToContent/SkipToContent";
import { QuackProvider } from "../../quack/QuackContext";
import Quack from "../../quack/Quack";
import "./PageLayout.scss";

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { error: null };
	}

	static getDerivedStateFromError(error) {
		return { error };
	}

	componentDidCatch(error, info) {
		console.error("Page error:", error, info);
	}

	render() {
		if (this.state.error) {
			return (
				<div className="page-error">
					<pre className="page-error__pre">
						Exception in thread &quot;main&quot;{"\n"}{String(this.state.error)}
					</pre>
					<div className="page-error__actions">
						<button
							type="button"
							className="btn btn--solid"
							onClick={() => window.location.reload()}
						>
							Reload
						</button>
						<Link to="/" className="btn btn--outline">← Home</Link>
					</div>
				</div>
			);
		}
		return this.props.children;
	}
}

export default function PageLayout() {
	const location = useLocation();

	// Scroll to top (or to the hash section) on every route change
	useEffect(() => {
		const hash = location.hash;
		if (hash) {
			const target = document.getElementById(hash.slice(1));
			if (target) {
				target.scrollIntoView({ block: "start" });
				return;
			}
		}
		window.scrollTo(0, 0);
	}, [location.pathname, location.hash]);

	return (
		<QuackProvider>
			<StageProvider>
				<ChromeProvider>
					<div className="page-layout" id="top">
						<SkipToContent />
						<Stage />
						<Chrome />
						<SectionPill />
						<main id="main-content" className="page-layout__main">
							<ErrorBoundary>
								<Outlet />
							</ErrorBoundary>
						</main>
						<Quack />
					</div>
				</ChromeProvider>
			</StageProvider>
		</QuackProvider>
	);
}

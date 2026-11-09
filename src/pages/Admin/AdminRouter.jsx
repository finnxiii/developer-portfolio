import { useState, useEffect, useCallback, useRef } from "react";
import { Routes, Route, Navigate, NavLink, Link, useLocation } from "react-router-dom";
import { TokenStatusContext } from "./token-context";
import { DraftProvider } from "./DraftContext";
import { useDraftCtx } from "./useDraftCtx";
import { QuackProvider } from "../../components/quack/QuackContext";
import Quack from "../../components/quack/Quack";
import AdminOverview from "./AdminOverview";
import ContentEditor from "./ContentEditor";
import TokenPage from "./TokenPage";
import AdminCV from "./AdminCV";
import AdminPublish from "./AdminPublish";
import "./Admin.scss";

function bannerText(ts) {
	const d = ts.daysLeft;
	switch (ts.state) {
		case "warning":  return `GitHub token expires in ${d} day${d !== 1 ? "s" : ""}`;
		case "critical": return d !== null ? `GitHub token expires in ${d} day${d !== 1 ? "s" : ""}` : "GitHub token check failed";
		case "expired":  return "GitHub token has expired";
		case "invalid":  return "GitHub token is invalid or revoked";
		case "missing":  return "GitHub token is not configured";
		default:         return "GitHub token issue";
	}
}

const TOP_TABS = [
	{ label: "overview",    to: "/admin",         exact: true },
	{ label: "content/",   to: "/admin/content" },
	{ label: "cv.pdf",     to: "/admin/cv" },
	{ label: "token.env",  to: "/admin/token" },
];

function AdminBar() {
	const { stagedCount } = useDraftCtx();
	const location = useLocation();
	const [menuOpen, setMenuOpen] = useState(false);

	const tabActive = (tab) =>
		tab.exact
			? location.pathname === "/admin"
			: location.pathname.startsWith(tab.to);

	return (
		<header className="adm-bar">
			<Link to="/admin" className="adm-bar__logo">
				<span className="adm-bar__f">f.</span>
				<span className="adm-bar__suffix">admin</span>
			</Link>

			<nav className="adm-bar__tabs" aria-label="Admin sections">
				{TOP_TABS.map((tab) => (
					<Link key={tab.to} to={tab.to}
						className={"adm-bar__tab" + (tabActive(tab) ? " adm-bar__tab--on" : "")}
						aria-current={tabActive(tab) ? "page" : undefined}>
						{tab.label}
					</Link>
				))}
			</nav>

			<div className="adm-bar__right">
				<span className="adm-bar__access">signed in via Cloudflare Access</span>
				<a href="/" target="_blank" rel="noopener noreferrer" className="adm-bar__link">
					View site ↗
				</a>
				<a href="/cdn-cgi/access/logout" className="adm-bar__link">Log out</a>
				<Link to="/admin/publish"
					className={"adm-bar__publish" + (stagedCount > 0 ? " adm-bar__publish--active" : "")}>
					Review &amp; publish
					<span className="adm-bar__count" aria-label={`${stagedCount} sections staged`}>
						{stagedCount}
					</span>
				</Link>
			</div>

			<button type="button" className="adm-bar__menu"
				aria-label={menuOpen ? "Close menu" : "Open menu"}
				aria-expanded={menuOpen}
				onClick={() => setMenuOpen((o) => !o)}>
				☰
			</button>

			{menuOpen && (
				<div className="adm-bar__dropdown" role="menu">
					<a href="/" target="_blank" rel="noopener noreferrer" className="adm-bar__dd-item">
						View site ↗
					</a>
					<a href="/cdn-cgi/access/logout" className="adm-bar__dd-item">Log out</a>
					<Link to="/admin/publish" className="adm-bar__dd-item"
						onClick={() => setMenuOpen(false)}>
						Review &amp; publish ({stagedCount})
					</Link>
				</div>
			)}
		</header>
	);
}

function AdminLayout({ children }) {
	const [tokenStatus, setTokenStatus] = useState(null);

	const checkToken = useCallback(async () => {
		try {
			const res = await fetch("/api/admin/token-status");
			if (res.ok) setTokenStatus(await res.json());
		} catch { /* ignore */ }
	}, []);

	const checkRef = useRef(checkToken);
	useEffect(() => { checkRef.current = checkToken; }, [checkToken]);

	useEffect(() => {
		checkRef.current();
		const id = setInterval(() => checkRef.current(), 5 * 60 * 1000);
		return () => clearInterval(id);
	}, []);

	const isBad = tokenStatus && tokenStatus.state !== "ok";
	const isCritical = tokenStatus && ["critical", "expired", "invalid", "missing"].includes(tokenStatus.state);

	return (
		<TokenStatusContext.Provider value={{ tokenStatus, checkToken }}>
			<div className="adm">
				<AdminBar />
				{isBad && (
					<div className={`adm-banner adm-banner--${isCritical ? "critical" : "warning"}`}
						role="alert">
						{bannerText(tokenStatus)} — <Link to="/admin/token">renew →</Link>
					</div>
				)}
				<div className="adm-body">
					{children}
				</div>
				<Quack />
			</div>
		</TokenStatusContext.Provider>
	);
}

export default function AdminRouter() {
	return (
		<DraftProvider>
			<QuackProvider>
				<AdminLayout>
					<Routes>
						<Route index element={<AdminOverview />} />
						<Route path="content" element={<Navigate to="/admin/content/profile" replace />} />
						<Route path="content/:section" element={<ContentEditor />} />
						<Route path="cv" element={<AdminCV />} />
						<Route path="token" element={<TokenPage />} />
						<Route path="publish" element={<AdminPublish />} />
						<Route path="*" element={<Navigate to="/admin" replace />} />
					</Routes>
				</AdminLayout>
			</QuackProvider>
		</DraftProvider>
	);
}

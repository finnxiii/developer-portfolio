import { useState, useEffect, useCallback, useRef } from "react";
import { Routes, Route, Navigate, NavLink, Link } from "react-router-dom";
import { TokenStatusContext } from "./token-context";
import Dashboard from "./Dashboard";
import TokenPage from "./TokenPage";
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

function AdminLayout({ children }) {
	const [tokenStatus, setTokenStatus] = useState(null);

	const checkToken = useCallback(async () => {
		try {
			const res = await fetch("/api/admin/token-status");
			if (res.ok) setTokenStatus(await res.json());
		} catch { /* ignore */ }
	}, []);

	const checkTokenRef = useRef(checkToken);

	useEffect(() => {
		checkTokenRef.current();
		const id = setInterval(() => checkTokenRef.current(), 5 * 60 * 1000);
		return () => clearInterval(id);
	}, []);

	const isBad = tokenStatus && tokenStatus.state !== "ok";
	const isCritical = tokenStatus && ["critical", "expired", "invalid", "missing"].includes(tokenStatus.state);

	return (
		<TokenStatusContext.Provider value={{ tokenStatus, checkToken }}>
			<div className="adm">
				<header className="adm__header">
					<span className="adm__brand">FINNXIII.DEV Admin</span>
					<div className="adm__header-actions">
						<a className="adm-btn" href="/" target="_blank" rel="noopener noreferrer">View site ↗</a>
						<a className="adm-btn" href="/cdn-cgi/access/logout">Log out</a>
					</div>
				</header>

				<nav className="adm__nav" aria-label="Admin navigation">
					<NavLink
						to="/admin"
						end
						className={({ isActive }) => `adm__nav-link${isActive ? " adm__nav-link--active" : ""}`}
					>
						Dashboard
					</NavLink>
					<NavLink
						to="/admin/token"
						className={({ isActive }) => `adm__nav-link${isActive ? " adm__nav-link--active" : ""}`}
					>
						Token
						{isBad && <span className="adm__nav-dot" aria-label="Token issue" />}
					</NavLink>
				</nav>

				{isBad && (
					<div
						className={`adm__banner adm__banner--${isCritical ? "critical" : "warning"}`}
						role="alert"
					>
						{bannerText(tokenStatus)} —{" "}
						<Link to="/admin/token">renew →</Link>
					</div>
				)}

				{children}
			</div>
		</TokenStatusContext.Provider>
	);
}

export default function AdminRouter() {
	return (
		<AdminLayout>
			<Routes>
				<Route index element={<Dashboard />} />
				<Route path="token" element={<TokenPage />} />
				<Route path="*" element={<Navigate to="/admin" replace />} />
			</Routes>
		</AdminLayout>
	);
}

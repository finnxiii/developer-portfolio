import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useStage } from "../../stage/StageContext";
import { usePortfolioData } from "../../../hooks/usePortfolioData";
import "./PhoneNav.scss";

const SECTION_LABELS = {
	home:    "Home",
	bug:     "Find the bug",
	work:    "Case studies",
	log:     "Experience",
	tests:   "How I work",
	now:     "Now & notes",
	contact: "Contact",
};

export default function PhoneNav() {
	const { scenes, activeId } = useStage();
	const { data } = usePortfolioData();
	const { profile } = data;
	const [open, setOpen] = useState(false);
	const progRef  = useRef(null);
	const btnRef   = useRef(null);
	const sheetRef = useRef(null);

	const activeScene = scenes.find((s) => s.id === activeId);
	const isDark = activeScene?.dark ?? false;

	// Scroll progress line via RAF
	useEffect(() => {
		let rafId;
		const update = () => {
			const el = document.documentElement;
			const max = el.scrollHeight - el.clientHeight;
			const pct = max > 0 ? window.scrollY / max : 0;
			if (progRef.current) {
				progRef.current.style.transform = `scaleX(${pct})`;
			}
			rafId = requestAnimationFrame(update);
		};
		rafId = requestAnimationFrame(update);
		return () => cancelAnimationFrame(rafId);
	}, []);

	// Focus trap + Escape inside sheet
	useEffect(() => {
		if (!open || !sheetRef.current) return;
		const sheet = sheetRef.current;
		const focusable = sheet.querySelectorAll(
			'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
		);
		const first = focusable[0];
		const last  = focusable[focusable.length - 1];
		first?.focus();

		const handler = (e) => {
			if (e.key === "Escape") {
				setOpen(false);
				btnRef.current?.focus();
				return;
			}
			if (e.key !== "Tab") return;
			if (e.shiftKey) {
				if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
			} else {
				if (document.activeElement === last)  { e.preventDefault(); first?.focus(); }
			}
		};
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, [open]);

	// Prevent body scroll when sheet is open
	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
		return () => { document.body.style.overflow = ""; };
	}, [open]);

	const navigate = useCallback((id) => {
		setOpen(false);
		btnRef.current?.focus();
		requestAnimationFrame(() => {
			const el = document.getElementById(id);
			if (el) el.scrollIntoView({ block: "start" });
		});
	}, []);

	const close = useCallback(() => {
		setOpen(false);
		btnRef.current?.focus();
	}, []);

	return (
		<>
			<div
				className="phone-nav"
				data-dark={isDark ? "true" : undefined}
				role="banner"
			>
				<Link to="/" className="phone-nav__logo" aria-label="Go to home">
					f.
				</Link>

				<button
					ref={btnRef}
					className="phone-nav__btn"
					onClick={() => setOpen(true)}
					aria-expanded={open}
					aria-haspopup="dialog"
					aria-label={`Navigation — current section: ${activeScene?.fn ?? "home()"}`}
				>
					<span className="phone-nav__btn-ln">{activeScene?.ln ?? "01"}</span>
					{" "}
					<span className="phone-nav__btn-fn">{activeScene?.fn ?? "home()"}</span>
					{" "}
					<span className="phone-nav__btn-caret" aria-hidden="true">⌄</span>
				</button>

				<span
					ref={progRef}
					className="phone-nav__progress"
					aria-hidden="true"
				/>
			</div>

			{open && (
				<>
					<div
						className="phone-nav__scrim"
						onClick={close}
						aria-hidden="true"
					/>
					<div
						ref={sheetRef}
						className="phone-nav__sheet"
						role="dialog"
						aria-label="Page sections"
						aria-modal="true"
					>
						<div className="phone-nav__sheet-head">
							<span className="phone-nav__sheet-title">INDEX · Finn.java</span>
							<button
								className="phone-nav__sheet-close"
								onClick={close}
								aria-label="Close navigation"
							>
								×
							</button>
						</div>

						<nav className="phone-nav__sheet-list" aria-label="Sections">
							{scenes.map((s) => {
								const isActive = s.id === activeId;
								return (
									<button
										key={s.id}
										className={
											"phone-nav__sheet-row" +
											(isActive ? " phone-nav__sheet-row--active" : "")
										}
										onClick={() => navigate(s.id)}
										aria-current={isActive ? "true" : undefined}
									>
										<span className="phone-nav__sheet-ln">{s.ln}</span>
										<span className="phone-nav__sheet-label">
											{SECTION_LABELS[s.id] ?? s.fn}
										</span>
										<span className="phone-nav__sheet-fn">{s.fn}</span>
										{isActive && (
											<span className="phone-nav__sheet-here" aria-hidden="true">
												● you are here
											</span>
										)}
									</button>
								);
							})}
						</nav>

						<div className="phone-nav__sheet-footer">
							{profile?.links?.cv && (
								<a href={profile.links.cv} target="_blank" rel="noopener noreferrer">CV ↗</a>
							)}
							{profile?.links?.github && (
								<a href={profile.links.github} target="_blank" rel="noopener noreferrer">GitHub</a>
							)}
							{profile?.links?.linkedin && (
								<a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
							)}
							{profile?.links?.email && (
								<a href={`mailto:${profile.links.email}`}>Email</a>
							)}
						</div>
					</div>
				</>
			)}
		</>
	);
}

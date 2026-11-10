import { useState, useEffect, useRef } from "react";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useQuack } from "../../components/quack/QuackContext";
import { useStagedCvUrl } from "../../lib/useStagedCvUrl";
import { usePreviewMode } from "../../lib/usePreviewMode";
import Footer from "../../components/layout/Footer/Footer";
import Cmd from "../../components/ui/Cmd/Cmd";

const ENDPOINTS = [
	{
		key: "email",
		method: "POST",
		name: "Email",
		color: "#F2C230",
		response: "202 Accepted · opens your mail app",
		getHref: (links) => links.email ? `mailto:${links.email}` : null,
		getHandle: (links) => links.email ?? "",
		external: false,
	},
	{
		key: "github",
		method: "GET",
		name: "GitHub",
		color: "#8FD3A0",
		response: "200 OK · /finnxiii on GitHub",
		getHref: (links) => links.github ?? null,
		getHandle: () => "@finnxiii",
		external: true,
	},
	{
		key: "linkedin",
		method: "GET",
		name: "LinkedIn",
		color: "#9EC5E8",
		response: "200 OK · /in/nainghtoolwin",
		getHref: (links) => links.linkedin ?? null,
		getHandle: () => "/in/nainghtoolwin",
		external: true,
	},
	{
		key: "cv",
		method: "GET",
		name: "CV",
		color: "#E8A86A",
		response: "200 OK · opens PDF",
		getHref: (links) => links.cv ?? null,
		getHandle: () => "finnxiii.dev/cv",
		external: true,
	},
];

function ContactEndpoint({ ep, links }) {
	const href = ep.getHref(links);
	if (!href) return null;
	return (
		<a
			href={href}
			className="ep"
			style={{ "--ep-c": ep.color }}
			{...(ep.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
		>
			<span className="ep__method fp-label">{ep.method}</span>
			<span className="ep__name">{ep.name}</span>
			<span className="ep__handle fp-label">{ep.getHandle(links)}</span>
			<span className="ep__arrow" aria-hidden="true">↗</span>
			<span className="ep__response fp-label">{ep.response}</span>
		</a>
	);
}

export default function ContactSection() {
	const { data } = usePortfolioData();
	const { profile = {} } = data;
	const avail = profile.availability ?? {};
	const links = profile.links ?? {};
	const { setQuips } = useQuack();
	const { isPreview } = usePreviewMode();
	const stagedCv = useStagedCvUrl(isPreview);
	const resolvedLinks = stagedCv ? { ...links, cv: stagedCv } : links;

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [status, setStatus] = useState("idle");
	const [honeypot, setHoneypot] = useState("");
	const turnstileRef = useRef(null);
	const tokenRef = useRef("");
	const widgetIdRef = useRef(null);

	const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

	useEffect(() => {
		if (!SITE_KEY || !turnstileRef.current) return;
		let scriptEl = document.getElementById("cf-turnstile-script");
		const renderWidget = () => {
			if (!window.turnstile || !turnstileRef.current) return;
			widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
				sitekey: SITE_KEY,
				callback: (token) => { tokenRef.current = token; },
				"expired-callback": () => { tokenRef.current = ""; },
			});
		};
		if (!scriptEl) {
			scriptEl = document.createElement("script");
			scriptEl.id = "cf-turnstile-script";
			scriptEl.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__cfTurnstileReady";
			scriptEl.async = true;
			scriptEl.defer = true;
			window.__cfTurnstileReady = renderWidget;
			document.head.appendChild(scriptEl);
		} else if (window.turnstile) {
			renderWidget();
		}
		return () => {
			if (widgetIdRef.current != null && window.turnstile) {
				try { window.turnstile.remove(widgetIdRef.current); } catch { /* ignore */ }
			}
		};
	}, [SITE_KEY]);

	async function handleSubmit(e) {
		e.preventDefault();
		if (honeypot) return;
		if (status === "sending") return;
		setStatus("sending");

		try {
			const body = { name, email, message };
			if (SITE_KEY) body.turnstileToken = tokenRef.current;
			const res = await fetch("/api/message", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			if (res.ok) {
				setStatus("success");
				setName(""); setEmail(""); setMessage(""); tokenRef.current = "";
				if (widgetIdRef.current != null && window.turnstile) {
					window.turnstile.reset(widgetIdRef.current);
				}
				setTimeout(() => setQuips(["Message delivered. I flew it there myself."]), 0);
			} else {
				setStatus("error");
			}
		} catch {
			setStatus("error");
		}
	}

	const responseText =
		status === "success" ? "HTTP/1.1 202 Accepted · Quack is carrying it to Finn's inbox." :
		status === "error"   ? "HTTP/1.1 503 · use the email link above for now" :
		"";
	const responseColor =
		status === "success" ? "var(--pass-on-dark)" :
		status === "error"   ? "var(--fail)" :
		"transparent";

	return (
		<div className="contact-section">
			<span className="fp-label contact-section__return">return finn;</span>
			<h2 className="contact-section__h2">
				{avail.headline ?? avail.detail ?? "Open to a 12-month placement."}
			</h2>
			<p className="contact-section__standfirst">
				If you&rsquo;re hiring, or just want to talk about testing and debugging, pick an endpoint.
			</p>

			<nav className="eps" aria-label="Contact">
				{ENDPOINTS.map((ep) => (
					<ContactEndpoint key={ep.key} ep={ep} links={resolvedLinks} />
				))}
			</nav>

			<div className="contact-form-row">
				<div className="contact-form-intro">
					<span className="fp-label contact-form-intro__label">or leave a message here</span>
					<p className="contact-form-intro__body">
						No mail app needed. It lands in the same inbox as the email link.
					</p>
				</div>
				<form className="req" onSubmit={handleSubmit} noValidate>
					<div className="req__status-bar fp-label">
						POST /api/message <span className="req__http">HTTP/1.1</span>
					</div>
					<label style={{ display: "none" }} aria-hidden="true">
						leave blank
						<input tabIndex={-1} value={honeypot} onChange={(e) => setHoneypot(e.target.value)} autoComplete="off" />
					</label>
					<label className="req__field">
						<span className="req__label">name</span>
						<input
							className="req__input"
							value={name}
							onChange={(e) => setName(e.target.value)}
							autoComplete="name"
							required
							disabled={status === "sending" || status === "success"}
						/>
					</label>
					<label className="req__field">
						<span className="req__label">email</span>
						<input
							className="req__input"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							autoComplete="email"
							required
							disabled={status === "sending" || status === "success"}
						/>
					</label>
					<label className="req__field">
						<span className="req__label">message</span>
						<textarea
							className="req__input req__input--ta"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							required
							rows={4}
							disabled={status === "sending" || status === "success"}
						/>
					</label>
					{SITE_KEY && <div ref={turnstileRef} className="req__turnstile" />}
					<div className="req__footer">
						<span className="req__response fp-label" aria-live="polite" style={{ color: responseColor }}>
							{responseText}
						</span>
						<Cmd
							type="submit"
							glyph="⏎"
							variant="duck"
							disabled={status === "sending" || status === "success"}
						>
							{status === "sending" ? "sending…" : "send request"}
						</Cmd>
					</div>
				</form>
			</div>

			<Footer />
		</div>
	);
}

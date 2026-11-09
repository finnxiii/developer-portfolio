import { useState, useEffect, useRef } from "react";
import SEOHead from "../../components/ui/SEOHead/SEOHead";
import StageSection from "../../components/stage/StageSection";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useQuack } from "../../components/quack/QuackContext";
import { usePointerParallax } from "../../components/stage/usePointerParallax";
import { useSideArtFit } from "../../hooks/useSideArtFit";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import Footer from "../../components/layout/Footer/Footer";
import { deriveTestName } from "../../lib/testName";
import "./TheEngineer.scss";

const ABOUT_QUIPS = [
	"That stack trace is his CV. Click a frame.",
	"Every principle has evidence. He made sure.",
	"Hire him. I'll come too.",
];

function expFileName(exp) {
	const { org, role } = exp;
	if (role.includes("Demonstrator")) return "COM114.java";
	if (org.includes("Project Echo")) return "ProjectEcho.kt";
	if (org.includes("iForge")) return "IForge.java";
	if (org.includes("Kith")) return "KithAILab.java";
	if (role.toLowerCase().includes("meng") || role.toLowerCase().includes("computer science")) return "Sheffield.java";
	return org.split(/\s+/).slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("") + ".java";
}


function refLabel(projectLink) {
	if (!projectLink) return "—";
	const seg = projectLink.split("/").pop();
	if (!seg) return "—";
	if (seg === "three-portfolio-designs") return "Field note";
	return seg.split("-").map(w => w.toUpperCase() === w ? w : w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

// ── Hello scene ───────────────────────────────────────────────────

function HelloScene({ profile }) {
	const sceneRef = useRef(null);
	usePointerParallax(sceneRef);
	const cardFits = useSideArtFit(430);

	return (
		<div className="about-hello-scene" ref={sceneRef}>
			{cardFits && (
				<div
					className="about-hello-scene__card"
					aria-hidden="true"
					style={{ transform: "translate(var(--px2,0), var(--py2,0))" }}
				>
					<div className="term-bar term-bar--light">
						<i className="term-bar__dot term-bar__dot--muted" />
						<i className="term-bar__dot term-bar__dot--muted" />
						<i className="term-bar__dot term-bar__dot--muted" />
						<span>About.java</span>
					</div>
					<pre className="about-hello-scene__code">{`public class Finn {
    String based   = "${profile.location}";
    String studies = "MEng Computer Science";
    int    since   = 2024;

    void work() {
        understand();
        build();
        test();
        breakIt();
        fix();
    }
}`}</pre>
				</div>
			)}
		</div>
	);
}

// ── Experience scene ──────────────────────────────────────────────

function ExperienceScene({ experience }) {
	const sceneRef = useRef(null);
	usePointerParallax(sceneRef);
	const traceFits = useSideArtFit(360);

	const lines = experience.map((exp) => {
		const fn = exp.role.split(/\s+/).slice(0, 2)
			.map((w, i) => i === 0 ? w.charAt(0).toLowerCase() + w.slice(1).toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
			.join("") + "()";
		const file = expFileName(exp);
		return `  Finn.${fn.padEnd(28)}${file}`;
	});

	return (
		<div className="about-stack-scene" ref={sceneRef}>
			{traceFits && (
				<pre
					className="about-stack-scene__trace"
					aria-hidden="true"
					style={{ transform: "translate(var(--px2,0), var(--py2,0))" }}
				>
					{`Thread [main] (Suspended)\n${lines.join("\n")}\n  Finn.main(String[])`}
				</pre>
			)}
		</div>
	);
}

// ── Principles scene ──────────────────────────────────────────────

function PrinciplesScene() {
	const reduced = useReducedMotion();
	const ticks = Array.from({ length: 80 }, (_, i) =>
		"✓ " + ["passed", "green", "ok", "passed"][i % 4]
	).join("\n");

	return (
		<div className="about-principles-scene">
			<pre
				className={"about-principles-scene__ticks" + (reduced ? "" : " about-principles-scene__ticks--rise")}
				aria-hidden="true"
			>
				{ticks}
			</pre>
		</div>
	);
}

// ── Contact scene ─────────────────────────────────────────────────

function ContactScene() {
	const reduced = useReducedMotion();
	return (
		<div className="about-contact-scene" aria-hidden="true">
			<div className={"about-contact-scene__glow about-contact-scene__glow--1" + (reduced ? " about-contact-scene__glow--still" : "")} />
			<div className={"about-contact-scene__glow about-contact-scene__glow--2" + (reduced ? " about-contact-scene__glow--still" : "")} />
		</div>
	);
}

// ── Sections ──────────────────────────────────────────────────────

function HelloSection({ profile }) {
	return (
		<div className="about-hello">
			<span className="about-hello__label">About.java</span>
			<h1 className="about-hello__h1">Hi, I'm Finn.</h1>
			<p className="about-hello__bio">{profile.bio}</p>
			<div className="about-hello__facts">
				<div className="about-hello__fact">
					<span className="about-hello__fact-key">based</span>
					<span>{profile.location}</span>
				</div>
				<div className="about-hello__fact">
					<span className="about-hello__fact-key">studying</span>
					<span>MEng Computer Science</span>
				</div>
				<div className="about-hello__fact">
					<span className="about-hello__fact-key">graduating</span>
					<span>{profile.graduation}</span>
				</div>
			</div>
		</div>
	);
}

function ExperienceSection({ experience }) {
	const [openIdx, setOpenIdx] = useState(0);

	return (
		<div className="about-stack">
			<div className="about-stack__header">
				<h2 className="about-stack__h2">Experience</h2>
				<span className="about-stack__hint">Thread [main] · click a frame to expand</span>
			</div>
			<div className="about-stack__list">
				{experience.map((exp, i) => {
					const open = openIdx === i;
					const arrow = open ? "▾" : exp.current ? "▶" : "▸";
					const file = expFileName(exp);
					return (
						<div
							key={i}
							className={"about-exp-item" + (open ? " about-exp-item--open" : "")}
						>
							<button
								type="button"
								className="about-exp-item__btn"
								aria-expanded={open}
								onClick={() => setOpenIdx(open ? -1 : i)}
							>
								<span className="about-exp-item__arrow">{arrow}</span>
								<span className="about-exp-item__meta">
									<span className="about-exp-item__role">{exp.role}</span>
									<span className="about-exp-item__org">at {exp.org} ({file})</span>
								</span>
								<span
									className="about-exp-item__date"
									style={{ color: exp.current ? "var(--pass)" : "var(--muted)" }}
								>
									{exp.dateRange}
								</span>
							</button>
							{open && (
								<ul className="about-exp-item__bullets">
									{(exp.bullets ?? []).map((b, j) => (
										<li key={j}>{b}</li>
									))}
								</ul>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

function PrinciplesSection({ philosophy }) {
	const [openIdx, setOpenIdx] = useState(0);

	return (
		<div className="about-principles">
			<div className="about-principles__header">
				<h2 className="about-principles__h2">Principles</h2>
				<span className="about-principles__hint">FinnTest.java · click a test to see the evidence</span>
			</div>
			<div className="about-principles__list">
				{philosophy.map((item, i) => {
					const open = openIdx === i;
					const name = item.testName ?? deriveTestName(item.principle);
					return (
						<div key={i} className="about-prin-item">
							<button
								type="button"
								className="about-prin-item__btn"
								aria-expanded={open}
								onClick={() => setOpenIdx(open ? -1 : i)}
							>
								<span className="about-prin-item__check">✓</span>
								<span className="about-prin-item__name">{name}()</span>
								<span className="about-prin-item__chevron" aria-hidden="true">
									{open ? "▴" : "▾"}
								</span>
							</button>
							{open && (
								<div className="about-prin-item__body">
									<p className="about-prin-item__principle">{item.principle}</p>
									<p className="about-prin-item__position">{item.position}</p>
									<p className="about-prin-item__example">{item.example}</p>
									{item.projectLink && (
										<a
											href={item.projectLink}
											className="about-prin-item__evidence"
										>
											evidence: {refLabel(item.projectLink)} →
										</a>
									)}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

function ContactSection({ profile }) {
	const { availability, links } = profile;
	return (
		<div className="about-contact">
			<span className="about-contact__label">return finn;</span>
			<h2 className="about-contact__h2">
				{availability?.detail ?? "Open to a 12-month industrial placement."}
			</h2>
			<p className="about-contact__body">
				If you're hiring, or just want to talk about testing and debugging, I'd like to hear from you.
			</p>
			<div className="about-contact__btns">
				{links.cv && (
					<a
						href={links.cv}
						className="btn btn--solid"
						target="_blank"
						rel="noopener noreferrer"
					>
						Download CV ↗
					</a>
				)}
				{links.email && (
					<a href={`mailto:${links.email}`} className="btn btn--outline">
						Email me
					</a>
				)}
			</div>
			<Footer />
		</div>
	);
}

// ── Page ──────────────────────────────────────────────────────────

export default function TheEngineer() {
	const { data } = usePortfolioData();
	const { profile = {}, experience = [], philosophy = [] } = data;
	const { setQuips } = useQuack();

	useEffect(() => {
		setTimeout(() => setQuips(ABOUT_QUIPS), 0);
	}, [setQuips]);

	return (
		<>
			<SEOHead
				title="About"
				description={profile.bio ?? "Software engineering student at the University of Sheffield."}
			/>

			<StageSection
				id="hello"
				fn="hello()"
				ln="01"
				bg="var(--paper)"
				dark={false}
				scene={<HelloScene profile={profile} />}
			>
				<HelloSection profile={profile} />
			</StageSection>

			<StageSection
				id="experience"
				fn="experience()"
				ln="12"
				bg="var(--paper-2)"
				dark={false}
				scene={<ExperienceScene experience={experience} />}
			>
				<ExperienceSection experience={experience} />
			</StageSection>

			<StageSection
				id="principles"
				fn="principles()"
				ln="30"
				bg="var(--dark-scene)"
				dark={true}
				scene={<PrinciplesScene />}
			>
				<PrinciplesSection philosophy={philosophy} />
			</StageSection>

			<StageSection
				id="contact"
				fn="contact()"
				ln="44"
				bg="var(--warm-scene)"
				dark={false}
				scene={<ContactScene />}
			>
				<ContactSection profile={profile} />
			</StageSection>
		</>
	);
}

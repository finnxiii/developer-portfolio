import { useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import { useDraftCtx } from "./useDraftCtx";
import { useQuack } from "../../components/quack/QuackContext";
import { computeSectionDiff } from "./draft/diff";
import { deriveTestName } from "../../lib/testName";

// ── Primitive form widgets ────────────────────────────────────────

function Field({ id, label, value, onChange, type = "text", rows, placeholder, hint, error, mono }) {
	const hasErr = Boolean(error);
	const cls = "ae-input" + (mono ? " ae-input--mono" : "") + (hasErr ? " ae-input--err" : "");
	const descIds = [hint && `${id}-h`, hasErr && `${id}-e`].filter(Boolean).join(" ") || undefined;

	return (
		<div className="ae-field">
			<label htmlFor={id} className="ae-label">{label}</label>
			{hint && <span id={`${id}-h`} className="ae-hint">{hint}</span>}
			{rows ? (
				<textarea id={id} className={cls + " ae-input--ta"} value={value ?? ""} rows={rows}
					placeholder={placeholder} aria-describedby={descIds}
					onChange={(e) => onChange(e.target.value)} />
			) : (
				<input id={id} type={type} className={cls} value={value ?? ""}
					placeholder={placeholder} aria-describedby={descIds}
					onChange={(e) => onChange(e.target.value)} />
			)}
			{hasErr && <span id={`${id}-e`} className="ae-error" role="alert">{error}</span>}
		</div>
	);
}

function Toggle({ id, label, checked, onChange }) {
	return (
		<label htmlFor={id} className="ae-toggle">
			<input id={id} type="checkbox" checked={Boolean(checked)}
				onChange={(e) => onChange(e.target.checked)} />
			<span>{label}</span>
		</label>
	);
}

function Seg({ label, options, value, onChange }) {
	return (
		<div className="ae-field">
			<span className="ae-label">{label}</span>
			<div className="ae-seg" role="radiogroup" aria-label={label}>
				{options.map((opt) => (
					<button key={opt} type="button" role="radio" aria-checked={value === opt}
						className={"ae-seg__btn" + (value === opt ? " ae-seg__btn--on" : "")}
						onClick={() => onChange(opt)}>
						{opt}
					</button>
				))}
			</div>
		</div>
	);
}

function ChipField({ id, label, chips, onAdd, onRemove, placeholder }) {
	const [input, setInput] = useState("");
	const submit = (e) => {
		e.preventDefault();
		const v = input.trim();
		if (v) { onAdd(v); setInput(""); }
	};
	return (
		<div className="ae-field">
			<span className="ae-label">{label}</span>
			<div className="ae-chips">
				{chips.map((c, i) => (
					<span key={i} className="ae-chip">
						{c}
						<button type="button" className="ae-chip__x" onClick={() => onRemove(i)}
							aria-label={`Remove ${c}`}>×</button>
					</span>
				))}
			</div>
			<form onSubmit={submit} className="ae-chip-row">
				<label htmlFor={id} className="ae-sr">{`Add ${label}`}</label>
				<input id={id} className="ae-input" value={input} placeholder={placeholder}
					onChange={(e) => setInput(e.target.value)} />
				<button type="submit" className="ae-btn">Add</button>
			</form>
		</div>
	);
}

function BulletsField({ id, label, value, onChange, hint }) {
	return (
		<Field id={id} label={label} hint={hint}
			value={Array.isArray(value) ? value.join("\n") : (value ?? "")}
			onChange={(v) => onChange(v.split("\n").map((s) => s.trim()).filter(Boolean))}
			rows={5} />
	);
}

function NumbersField({ numbers, onChange }) {
	const nums = Array.isArray(numbers) ? numbers : [];
	return (
		<div className="ae-field">
			<div className="ae-field-hd">
				<span className="ae-label">Numbers</span>
				<button type="button" className="ae-btn ae-btn--sm"
					onClick={() => onChange([...nums, { value: "", label: "" }])}>+ Add</button>
			</div>
			{nums.map((n, i) => (
				<div key={i} className="ae-nums-row">
					<input className="ae-input ae-input--num" placeholder="value" value={n.value ?? ""}
						aria-label={`Number ${i + 1} value`}
						onChange={(e) => onChange(nums.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} />
					<input className="ae-input" placeholder="label" value={n.label ?? ""}
						aria-label={`Number ${i + 1} label`}
						onChange={(e) => onChange(nums.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} />
					<button type="button" className="ae-xbtn" aria-label={`Remove number ${i + 1}`}
						onClick={() => onChange(nums.filter((_, j) => j !== i))}>×</button>
				</div>
			))}
		</div>
	);
}

// ── Helpers ───────────────────────────────────────────────────────

const slugify = (s) =>
	s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function simpleMarkdown(text) {
	return text
		.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
		.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
		.replace(/\*(.+?)\*/g, "<em>$1</em>")
		.replace(/`(.+?)`/g, "<code>$1</code>")
		.replace(/\n/g, "<br>");
}

// ── Section forms ─────────────────────────────────────────────────

function ProfileForm({ data, onChange }) {
	const set = (k) => (v) => onChange({ ...data, [k]: v });
	const setLink = (k) => (v) => onChange({ ...data, links: { ...data.links, [k]: v } });
	const setAvail = (k) => (v) =>
		onChange({ ...data, availability: { ...(data.availability ?? {}), [k]: v } });

	return (
		<div className="ae-form">
			<div className="ae-card">
				<h2 className="ae-card__h2">Identity</h2>
				<div className="ae-grid-2">
					<Field id="p-name" label="Name" value={data.name} onChange={set("name")} />
					<Field id="p-role" label="Role" value={data.role} onChange={set("role")} />
					<Field id="p-loc" label="Location" value={data.location} onChange={set("location")} />
					<Field id="p-grad" label="Graduation" value={data.graduation} onChange={set("graduation")} />
				</div>
				<Field id="p-bio" label="Bio" value={data.bio} onChange={set("bio")} rows={4} />
				<Field id="p-headline" label="Hero headline" value={data.heroHeadline} onChange={set("heroHeadline")} />
				<Field id="p-standfirst" label="Hero standfirst" value={data.heroStandfirst}
					onChange={set("heroStandfirst")} rows={3} />
				<ChipField id="p-interests" label="Interests"
					chips={data.interests ?? []}
					onAdd={(v) => set("interests")([...(data.interests ?? []), v])}
					onRemove={(i) => set("interests")((data.interests ?? []).filter((_, j) => j !== i))}
					placeholder="e.g. Mobile Development"
				/>
			</div>
			<div className="ae-card">
				<h2 className="ae-card__h2">Links</h2>
				<div className="ae-grid-2">
					<Field id="p-email" label="Email" type="email" value={data.links?.email} onChange={setLink("email")} />
					<Field id="p-github" label="GitHub" type="url" value={data.links?.github} onChange={setLink("github")} />
					<Field id="p-linkedin" label="LinkedIn" type="url" value={data.links?.linkedin} onChange={setLink("linkedin")} />
					<Field id="p-cv" label="CV path" value={data.links?.cv} onChange={setLink("cv")} placeholder="/NaingHtooLwin-CV.pdf" />
				</div>
			</div>
			<div className="ae-card">
				<h2 className="ae-card__h2">Availability</h2>
				<p className="ae-hint ae-hint--block">Leave status blank to hide the availability ear.</p>
				<div className="ae-grid-2">
					<Field id="p-av-status" label="Status" value={data.availability?.status}
						onChange={setAvail("status")} placeholder="Open to placements" />
					<Field id="p-av-cta" label="CTA label" value={data.availability?.cta}
						onChange={setAvail("cta")} placeholder="Download CV" />
					<Field id="p-av-href" label="CTA href" value={data.availability?.href}
						onChange={setAvail("href")} placeholder="/NaingHtooLwin-CV.pdf" />
				</div>
				<Field id="p-av-detail" label="Detail" value={data.availability?.detail}
					onChange={setAvail("detail")} placeholder="Italic line below status" />
			</div>
		</div>
	);
}

const CASE_TABS = [
	{ key: "problem",        label: "problem" },
	{ key: "investigation",  label: "investigation" },
	{ key: "implementation", label: "implementation" },
	{ key: "whatBroke",      label: "what broke" },
	{ key: "outcome",        label: "outcome" },
	{ key: "learned",        label: "learned" },
];

const PROJECT_STATUS = ["In development", "Completed", "Prototype"];

const EMPTY_PROJECT = {
	slug: "", category: "", title: "", deck: "", featured: false, leadProject: false,
	role: "", timeframe: "", team: "", status: "In development",
	stack: [], github: "", live: null, relatedNote: "", numbers: [], pullQuote: "",
	figureCaption: "",
	sections: { problem: "", investigation: "", implementation: "", whatBroke: "", outcome: "", learned: "" },
};

function ProjectItem({ project, onChange, onDelete, isOpen, onToggle }) {
	const [caseTab, setCaseTab] = useState("problem");
	const set = (k) => (v) => onChange({ ...project, [k]: v });
	const setSection = (k) => (v) =>
		onChange({ ...project, sections: { ...project.sections, [k]: v } });

	return (
		<div className="ae-list-item">
			<button type="button" className="ae-list-item__btn" onClick={onToggle}>
				<span className="ae-list-item__arrow">{isOpen ? "▾" : "▸"}</span>
				<span className="ae-list-item__title">{project.title || "Untitled project"}</span>
				<span className="ae-list-item__meta">{[project.category, project.status].filter(Boolean).join(" · ")}</span>
			</button>
			{isOpen && (
				<div className="ae-list-item__body">
					<div className="ae-card">
						<h3 className="ae-card__h3">basics</h3>
						<div className="ae-grid-2">
							<Field id={`pj-title-${project.slug}`} label="Title" value={project.title}
								onChange={(v) => onChange({ ...project, title: v, slug: project.slug || slugify(v) })} />
							<Field id={`pj-slug-${project.slug}`} label="Slug" value={project.slug}
								onChange={set("slug")} hint="URL-safe identifier" mono />
							<Field id={`pj-cat-${project.slug}`} label="Category" value={project.category}
								onChange={set("category")} placeholder="MOBILE ENGINEERING" />
							<Field id={`pj-role-${project.slug}`} label="Role" value={project.role}
								onChange={set("role")} />
							<Field id={`pj-time-${project.slug}`} label="Timeframe" value={project.timeframe}
								onChange={set("timeframe")} />
							<Field id={`pj-team-${project.slug}`} label="Team" value={project.team}
								onChange={set("team")} />
						</div>
						<Field id={`pj-deck-${project.slug}`} label="Deck" value={project.deck}
							onChange={set("deck")}
							hint={`${(project.deck ?? "").length}/220 characters`} />
						<Seg label="Status" options={PROJECT_STATUS} value={project.status} onChange={set("status")} />
					</div>
					<div className="ae-card">
						<h3 className="ae-card__h3">stack &amp; numbers</h3>
						<ChipField id={`pj-stack-${project.slug}`} label="Stack"
							chips={project.stack ?? []}
							onAdd={(v) => set("stack")([...(project.stack ?? []), v])}
							onRemove={(i) => set("stack")((project.stack ?? []).filter((_, j) => j !== i))}
							placeholder="Add a technology"
						/>
						<NumbersField numbers={project.numbers} onChange={set("numbers")} />
					</div>
					<div className="ae-card">
						<h3 className="ae-card__h3">case study</h3>
						<div className="ae-case-tabs" role="tablist">
							{CASE_TABS.map((t) => (
								<button key={t.key} type="button" role="tab" aria-selected={caseTab === t.key}
									className={"ae-case-tab" + (caseTab === t.key ? " ae-case-tab--on" : "")}
									onClick={() => setCaseTab(t.key)}>
									{t.label}
								</button>
							))}
						</div>
						<Field id={`pj-case-${project.slug}-${caseTab}`} label={caseTab}
							value={project.sections?.[caseTab] ?? ""} onChange={setSection(caseTab)}
							rows={12} hint="Markdown supported." mono />
					</div>
					<div className="ae-card">
						<h3 className="ae-card__h3">settings</h3>
						<div className="ae-grid-2">
							<Field id={`pj-github-${project.slug}`} label="GitHub URL"
								value={project.github ?? ""} onChange={set("github")} />
							<Field id={`pj-live-${project.slug}`} label="Live URL"
								value={project.live ?? ""} onChange={(v) => set("live")(v || null)} />
							<Field id={`pj-related-${project.slug}`} label="Related note"
								value={project.relatedNote ?? ""} onChange={set("relatedNote")}
								placeholder="/notes/slug" />
						</div>
						<Field id={`pj-pullquote-${project.slug}`} label="Pull quote"
							value={project.pullQuote ?? ""} onChange={set("pullQuote")} />
						<Field id={`pj-figcap-${project.slug}`} label="Figure caption"
							value={project.figureCaption ?? ""} onChange={set("figureCaption")} />
						<div className="ae-toggles">
							<Toggle id={`pj-feat-${project.slug}`} label="Featured on front page"
								checked={project.featured} onChange={set("featured")} />
							<Toggle id={`pj-lead-${project.slug}`} label="Lead project (largest card)"
								checked={project.leadProject} onChange={set("leadProject")} />
						</div>
					</div>
					<button type="button" className="ae-btn ae-btn--danger"
						onClick={() => { if (window.confirm("Delete this project?")) onDelete(); }}>
						Delete project
					</button>
				</div>
			)}
		</div>
	);
}

function ProjectsForm({ data, onChange }) {
	const [openIdx, setOpenIdx] = useState(null);
	const list = Array.isArray(data) ? data : [];

	return (
		<div className="ae-form">
			<div className="ae-list-hd">
				<h2 className="ae-list-hd__h2">Projects</h2>
				<button type="button" className="ae-btn" onClick={() => {
					onChange([...list, { ...EMPTY_PROJECT, slug: `project-${list.length + 1}` }]);
					setOpenIdx(list.length);
				}}>+ New project</button>
			</div>
			{list.map((project, i) => (
				<ProjectItem key={project.slug || i} project={project}
					isOpen={openIdx === i}
					onToggle={() => setOpenIdx(openIdx === i ? null : i)}
					onChange={(updated) => onChange(list.map((p, j) => j === i ? updated : p))}
					onDelete={() => { onChange(list.filter((_, j) => j !== i)); setOpenIdx(null); }}
				/>
			))}
		</div>
	);
}

function ExperienceForm({ data, onChange }) {
	const [openIdx, setOpenIdx] = useState(null);
	const list = Array.isArray(data) ? data : [];

	return (
		<div className="ae-form">
			<div className="ae-list-hd">
				<h2 className="ae-list-hd__h2">Experience</h2>
				<button type="button" className="ae-btn" onClick={() => {
					onChange([...list, { dateRange: "", org: "", role: "", bullets: [], current: false }]);
					setOpenIdx(list.length);
				}}>+ Add</button>
			</div>
			{list.map((exp, i) => {
				const isOpen = openIdx === i;
				const set = (k) => (v) =>
					onChange(list.map((e, j) => j === i ? { ...e, [k]: v } : e));
				return (
					<div key={i} className="ae-list-item">
						<button type="button" className="ae-list-item__btn"
							onClick={() => setOpenIdx(isOpen ? null : i)}>
							<span className="ae-list-item__arrow">{isOpen ? "▾" : "▸"}</span>
							<span className="ae-list-item__title">{exp.role || "Untitled role"}</span>
							<span className="ae-list-item__meta">
								{exp.org ? `at ${exp.org}` : ""}{exp.dateRange ? ` · ${exp.dateRange}` : ""}
							</span>
							{exp.current && <span className="ae-badge ae-badge--pass">Current</span>}
						</button>
						{isOpen && (
							<div className="ae-list-item__body">
								<div className="ae-card">
									<div className="ae-grid-2">
										<Field id={`ex-org-${i}`} label="Organisation" value={exp.org} onChange={set("org")} />
										<Field id={`ex-role-${i}`} label="Role" value={exp.role} onChange={set("role")} />
										<Field id={`ex-date-${i}`} label="Date range" value={exp.dateRange}
											onChange={set("dateRange")} placeholder="Jan 2025 — Present" />
									</div>
									<BulletsField id={`ex-bullets-${i}`} label="Bullets (one per line)"
										value={exp.bullets} onChange={set("bullets")} hint="Each line becomes a bullet" />
									<Toggle id={`ex-current-${i}`} label="Current position"
										checked={exp.current} onChange={set("current")} />
								</div>
								<button type="button" className="ae-btn ae-btn--danger"
									onClick={() => { if (window.confirm("Remove?")) { onChange(list.filter((_, j) => j !== i)); setOpenIdx(null); } }}>
									Delete
								</button>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}

function PrinciplesForm({ data, onChange }) {
	const [openIdx, setOpenIdx] = useState(null);
	const list = Array.isArray(data) ? data : [];

	return (
		<div className="ae-form">
			<div className="ae-list-hd">
				<h2 className="ae-list-hd__h2">Principles</h2>
				<button type="button" className="ae-btn" onClick={() => {
					onChange([...list, { principle: "", position: "", example: "", projectLink: "" }]);
					setOpenIdx(list.length);
				}}>+ Add</button>
			</div>
			{list.map((item, i) => {
				const isOpen = openIdx === i;
				const set = (k) => (v) =>
					onChange(list.map((e, j) => j === i ? { ...e, [k]: v } : e));
				const derived = item.testName ?? deriveTestName(item.principle);
				return (
					<div key={i} className="ae-list-item">
						<button type="button" className="ae-list-item__btn"
							onClick={() => setOpenIdx(isOpen ? null : i)}>
							<span className="ae-list-item__arrow">{isOpen ? "▾" : "▸"}</span>
							<span className="ae-list-item__title">{item.principle || "New principle"}</span>
						</button>
						{isOpen && (
							<div className="ae-list-item__body">
								<div className="ae-card">
									<Field id={`ph-prin-${i}`} label="Principle (ends with period)"
										value={item.principle} onChange={set("principle")} />
									<Field id={`ph-pos-${i}`} label="Position (one sentence)"
										value={item.position} onChange={set("position")} />
									<Field id={`ph-ex-${i}`} label="Example in practice"
										value={item.example} onChange={set("example")} rows={3} />
									<Field id={`ph-link-${i}`} label="Project link"
										value={item.projectLink} onChange={set("projectLink")}
										placeholder="/work/project-slug" />
									<Field id={`ph-name-${i}`} label="Test name override"
										value={item.testName ?? ""} onChange={set("testName")}
										hint={`Derived: ${derived}()`} placeholder="Leave blank to auto-derive" mono />
								</div>
								<button type="button" className="ae-btn ae-btn--danger"
									onClick={() => { if (window.confirm("Remove?")) { onChange(list.filter((_, j) => j !== i)); setOpenIdx(null); } }}>
									Delete
								</button>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}

function FieldNotesForm({ data, onChange }) {
	const [openIdx, setOpenIdx] = useState(null);
	const [preview, setPreview] = useState({});
	const list = Array.isArray(data) ? data : [];

	return (
		<div className="ae-form">
			<div className="ae-list-hd">
				<h2 className="ae-list-hd__h2">Field Notes</h2>
				<button type="button" className="ae-btn" onClick={() => {
					onChange([...list, { slug: "", title: "", date: "", topic: "", readTime: "", deck: "", relatedProject: "", body: "" }]);
					setOpenIdx(list.length);
				}}>+ New note</button>
			</div>
			{list.map((note, i) => {
				const isOpen = openIdx === i;
				const set = (k) => (v) =>
					onChange(list.map((e, j) => j === i ? { ...e, [k]: v } : e));
				const wordCount = (note.body ?? "").split(/\s+/).filter(Boolean).length;
				const isPrev = Boolean(preview[i]);
				return (
					<div key={note.slug || i} className="ae-list-item">
						<button type="button" className="ae-list-item__btn"
							onClick={() => setOpenIdx(isOpen ? null : i)}>
							<span className="ae-list-item__arrow">{isOpen ? "▾" : "▸"}</span>
							<span className="ae-list-item__title">{note.title || "Untitled note"}</span>
							<span className="ae-list-item__meta">
								{[note.date, note.topic].filter(Boolean).join(" · ")}
							</span>
						</button>
						{isOpen && (
							<div className="ae-list-item__body">
								<div className="ae-card">
									<div className="ae-grid-2">
										<Field id={`fn-title-${i}`} label="Title" value={note.title}
											onChange={(v) => onChange(list.map((e, j) =>
												j === i ? { ...e, title: v, slug: e.slug || slugify(v) } : e))} />
										<Field id={`fn-slug-${i}`} label="Slug" value={note.slug}
											onChange={set("slug")} mono />
										<Field id={`fn-date-${i}`} label="Date" type="date" value={note.date}
											onChange={set("date")} />
										<Field id={`fn-topic-${i}`} label="Topic" value={note.topic}
											onChange={set("topic")} />
										<Field id={`fn-read-${i}`} label="Read time" value={note.readTime}
											onChange={set("readTime")} placeholder="4 min"
											hint={`${wordCount} words ≈ ${Math.max(1, Math.ceil(wordCount / 200))} min`} />
										<Field id={`fn-deck-${i}`} label="Deck" value={note.deck ?? ""}
											onChange={set("deck")} />
									</div>
									<Field id={`fn-related-${i}`} label="Related project"
										value={note.relatedProject ?? ""} onChange={set("relatedProject")}
										placeholder="/work/project-slug" />
								</div>
								<div className="ae-card">
									<div className="ae-body-toggle">
										<span className="ae-label">Body (Markdown)</span>
										<button type="button"
											className={"ae-body-btn" + (!isPrev ? " ae-body-btn--on" : "")}
											onClick={() => setPreview((p) => ({ ...p, [i]: false }))}>Edit</button>
										<button type="button"
											className={"ae-body-btn" + (isPrev ? " ae-body-btn--on" : "")}
											onClick={() => setPreview((p) => ({ ...p, [i]: true }))}>Preview</button>
									</div>
									{isPrev ? (
										<div className="ae-md-preview fn-note__body"
											dangerouslySetInnerHTML={{ __html: simpleMarkdown(note.body ?? "") }} />
									) : (
										<textarea id={`fn-body-${i}`}
											className="ae-input ae-input--ta ae-input--mono ae-input--code"
											value={note.body ?? ""} rows={20}
											aria-label="Note body (Markdown)"
											onChange={(e) => set("body")(e.target.value)} />
									)}
								</div>
								<button type="button" className="ae-btn ae-btn--danger"
									onClick={() => { if (window.confirm("Delete note?")) { onChange(list.filter((_, j) => j !== i)); setOpenIdx(null); } }}>
									Delete note
								</button>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}

function NowForm({ data, onChange }) {
	const set = (k) => (v) => onChange({ ...data, [k]: v });
	return (
		<div className="ae-form">
			<div className="ae-card">
				<h2 className="ae-card__h2">Date</h2>
				<Field id="now-date" label="Date" value={data.date} onChange={set("date")}
					placeholder="November 2026"
					hint="e.g. November 2026 — update this whenever the Now page changes"
				/>
				<button type="button" className="ae-btn" onClick={() => {
					const now = new Date();
					set("date")(now.toLocaleDateString("en-GB", { month: "long", year: "numeric" }));
				}}>Mark as updated today</button>
			</div>
			<div className="ae-card">
				<h2 className="ae-card__h2">Building</h2>
				<div className="ae-grid-2">
					<Field id="now-bshort" label="Short name" value={data.buildingShort ?? ""}
						onChange={set("buildingShort")} placeholder="Vigil" />
					<Field id="now-blink" label="Case study link" value={data.buildingLink ?? ""}
						onChange={set("buildingLink")} placeholder="/work/vigil" />
				</div>
				<Field id="now-building" label="Description" value={data.building}
					onChange={set("building")} rows={3} />
			</div>
			<div className="ae-card">
				<h2 className="ae-card__h2">Learning</h2>
				<div className="ae-grid-2">
					<Field id="now-lshort" label="Short name" value={data.learningShort ?? ""}
						onChange={set("learningShort")} />
				</div>
				<Field id="now-learning" label="Description" value={data.learning}
					onChange={set("learning")} rows={3} />
			</div>
			<div className="ae-card">
				<h2 className="ae-card__h2">Exploring</h2>
				<div className="ae-grid-2">
					<Field id="now-eshort" label="Short name" value={data.exploringShort ?? ""}
						onChange={set("exploringShort")} />
				</div>
				<Field id="now-exploring" label="Description" value={data.exploring}
					onChange={set("exploring")} rows={3} />
			</div>
		</div>
	);
}

const TIMELINE_TYPES = ["feat", "test", "init"];
const TIMELINE_LANES = ["degree", "projects", "work"];

function TimelineForm({ data, onChange }) {
	const [openIdx, setOpenIdx] = useState(null);
	const list = Array.isArray(data) ? data : [];

	return (
		<div className="ae-form">
			<div className="ae-list-hd">
				<h2 className="ae-list-hd__h2">Timeline</h2>
				<button type="button" className="ae-btn" onClick={() => {
					onChange([{ date: "", type: "feat", lane: "work", message: "" }, ...list]);
					setOpenIdx(0);
				}}>+ Add entry</button>
			</div>
			{list.map((item, i) => {
				const isOpen = openIdx === i;
				const set = (k) => (v) =>
					onChange(list.map((e, j) => j === i ? { ...e, [k]: v } : e));
				return (
					<div key={i} className="ae-list-item">
						<button type="button" className="ae-list-item__btn"
							onClick={() => setOpenIdx(isOpen ? null : i)}>
							<span className="ae-list-item__arrow">{isOpen ? "▾" : "▸"}</span>
							<span className="ae-list-item__title">{item.message || "New entry"}</span>
							<span className="ae-list-item__meta">{[item.date, item.lane].filter(Boolean).join(" · ")}</span>
						</button>
						{isOpen && (
							<div className="ae-list-item__body">
								<div className="ae-card">
									<div className="ae-grid-2">
										<Field id={`tl-date-${i}`} label="Date (YYYY-MM)" value={item.date}
											onChange={set("date")} placeholder="2026-01" mono />
										<Field id={`tl-msg-${i}`} label="Message" value={item.message}
											onChange={set("message")} />
									</div>
									<Seg label="Type" options={TIMELINE_TYPES} value={item.type} onChange={set("type")} />
									<Seg label="Lane" options={TIMELINE_LANES} value={item.lane} onChange={set("lane")} />
								</div>
								<button type="button" className="ae-btn ae-btn--danger"
									onClick={() => { if (window.confirm("Remove?")) { onChange(list.filter((_, j) => j !== i)); setOpenIdx(null); } }}>
									Delete
								</button>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}

// ── Section config ────────────────────────────────────────────────

const SECTIONS = {
	profile:      { name: "Profile",      path: "profile",       previewPath: "/about" },
	projects:     { name: "Projects",     path: "projects/",     previewPath: "/work" },
	experience:   { name: "Experience",   path: "experience.json", previewPath: "/about" },
	philosophy:   { name: "Principles",   path: "philosophy.json", previewPath: "/about" },
	fieldNotes:   { name: "Field notes",  path: "notes/",        previewPath: "/notes" },
	currentFocus: { name: "Now",          path: "now.json",      previewPath: "/now" },
	timeline:     { name: "Timeline",     path: "timeline.json", previewPath: "/about" },
};

// ── Explorer sidebar ──────────────────────────────────────────────

function Explorer({ isSectionDirty }) {
	return (
		<nav className="ae-explorer" aria-label="Content sections">
			<span className="ae-explorer__hd">EXPLORER · content/</span>
			{Object.entries(SECTIONS).map(([key, meta]) => (
				<NavLink key={key} to={`/admin/content/${key}`}
					className={({ isActive }) =>
						"ae-explorer__link" + (isActive ? " ae-explorer__link--on" : "")}>
					<span className="ae-explorer__path">{meta.path}</span>
					{isSectionDirty(key) && (
						<span className="ae-explorer__m" aria-label="Modified">M</span>
					)}
				</NavLink>
			))}
		</nav>
	);
}

// ── Changes panel ─────────────────────────────────────────────────

function ChangesPanel({ section, base, draftVal, staged, onStage, onDiscard }) {
	const changes = computeSectionDiff(base?.[section], draftVal, section);
	const isStaged = staged.has(section);
	const [expanded, setExpanded] = useState({});

	return (
		<aside className="ae-changes" aria-label="Staged changes">
			<div className="ae-changes__hd">
				<h2 className="ae-changes__h2">Changes</h2>
				{changes.length > 0 && (
					<span className="ae-changes__count">{changes.length}</span>
				)}
			</div>

			{changes.length > 0 ? (
				<div className="ae-changes__list">
					{changes.slice(0, 20).map((c, i) => {
						const exp = expanded[i];
						const beforeStr = c.before !== null ? String(c.before ?? "") : null;
						const afterStr = c.after !== null ? String(c.after ?? "") : null;
						return (
							<div key={i} className="ae-chg">
								<span className="ae-chg__path">{c.path}</span>
								{beforeStr !== null && (
									<span className="ae-chg__before">
										{exp || beforeStr.length <= 60
											? beforeStr
											: beforeStr.slice(0, 60) + "…"}
									</span>
								)}
								{afterStr !== null && (
									<span className="ae-chg__after">
										{exp || afterStr.length <= 60
											? afterStr
											: afterStr.slice(0, 60) + "…"}
									</span>
								)}
								{((beforeStr?.length ?? 0) > 60 || (afterStr?.length ?? 0) > 60) && (
									<button type="button" className="ae-chg__expand"
										onClick={() => setExpanded((p) => ({ ...p, [i]: !p[i] }))}>
										{exp ? "less" : "more"}
									</button>
								)}
							</div>
						);
					})}
					{changes.length > 20 && (
						<p className="ae-changes__more">+{changes.length - 20} more</p>
					)}
				</div>
			) : (
				<p className="ae-changes__empty">Nothing changed yet.</p>
			)}

			<div className="ae-changes__actions">
				<button type="button" className="ae-changes__stage" onClick={onStage}
					disabled={!changes.length}>
					{isStaged ? "Re-stage" : "Stage changes"}
				</button>
				<button type="button" className="ae-changes__discard" onClick={onDiscard}
					disabled={!changes.length}>
					Discard
				</button>
			</div>

			{isStaged && (
				<p className="ae-changes__note">
					Staged. Nothing is live until you{" "}
					<Link to="/admin/publish">review &amp; publish</Link>.
				</p>
			)}
		</aside>
	);
}

// ── Main editor ───────────────────────────────────────────────────

export default function ContentEditor() {
	const { section = "profile" } = useParams();
	const {
		base, draft, staged,
		updateSection, stageSection, discardSection,
		isSectionDirty, loading, loadError,
	} = useDraftCtx();
	const { say } = useQuack();

	if (loading) return <div className="ae-loading">Loading content…</div>;
	if (loadError) return <div className="ae-load-err">{loadError}</div>;
	if (!draft) return null;

	const meta = SECTIONS[section];
	if (!meta) {
		return (
			<div className="adm-wrap">
				<p className="ae-load-err">Unknown section: <code>{section}</code></p>
			</div>
		);
	}

	const draftVal = draft[section];
	const handleChange = (val) => updateSection(section, val);

	const handleStage = () => {
		stageSection(section);
		say("Staged! Nothing's live until you publish.");
	};

	const handleDiscard = () => {
		if (window.confirm("Discard all changes to this section?")) {
			discardSection(section);
		}
	};

	const renderForm = () => {
		switch (section) {
			case "profile":      return <ProfileForm      data={draftVal} onChange={handleChange} />;
			case "projects":     return <ProjectsForm     data={draftVal} onChange={handleChange} />;
			case "experience":   return <ExperienceForm   data={draftVal} onChange={handleChange} />;
			case "philosophy":   return <PrinciplesForm   data={draftVal} onChange={handleChange} />;
			case "fieldNotes":   return <FieldNotesForm   data={draftVal} onChange={handleChange} />;
			case "currentFocus": return <NowForm          data={draftVal} onChange={handleChange} />;
			case "timeline":     return <TimelineForm     data={draftVal} onChange={handleChange} />;
			default: return <p>Unknown section.</p>;
		}
	};

	return (
		<div className="ae-wrap">
			<div className="ae-layout">
				<Explorer isSectionDirty={isSectionDirty} />

				<div className="ae-main">
					<div className="ae-main__title-row">
						<div>
							<span className="ae-main__path">content/{meta.path}</span>
							<h1 className="ae-main__h1">{meta.name}</h1>
						</div>
						<a href={meta.previewPath + "?preview=draft"} target="_blank" rel="noopener noreferrer"
							className="ae-btn">
							Preview draft ↗
						</a>
					</div>
					{renderForm()}
				</div>

				<ChangesPanel section={section} base={base} draftVal={draftVal}
					staged={staged} onStage={handleStage} onDiscard={handleDiscard} />
			</div>
		</div>
	);
}

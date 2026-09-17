import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../hooks/useAdmin";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import "./Admin.scss";

// ── Helpers ─────────────────────────────────────────────────────

const slugify = (s) =>
	s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

// ── Shared field components ──────────────────────────────────────

function Field({ label, id, value, onChange, type = "text", rows, placeholder, note }) {
	return (
		<div className="adm-field">
			<label className="adm-label" htmlFor={id}>{label}</label>
			{note && <span className="adm-note">{note}</span>}
			{rows ? (
				<textarea
					id={id}
					className="adm-textarea"
					value={value ?? ""}
					onChange={(e) => onChange(e.target.value)}
					rows={rows}
					placeholder={placeholder}
				/>
			) : (
				<input
					id={id}
					type={type}
					className="adm-input"
					value={value ?? ""}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
				/>
			)}
		</div>
	);
}

function Check({ label, checked, onChange }) {
	return (
		<label className="adm-check">
			<input type="checkbox" checked={Boolean(checked)} onChange={(e) => onChange(e.target.checked)} />
			{label}
		</label>
	);
}

// ── Generic CRUD list ────────────────────────────────────────────

function CrudList({ items, onUpdate, getKey, renderSummary, emptyItem, renderForm }) {
	const [editIdx, setEditIdx] = useState(null);
	const [draft, setDraft] = useState(null);

	const startEdit = (idx) => { setEditIdx(idx); setDraft(deepClone(items[idx])); };
	const startAdd = () => { setEditIdx(-1); setDraft(deepClone(emptyItem)); };

	const commit = () => {
		const next = [...items];
		if (editIdx === -1) next.push(draft);
		else next[editIdx] = draft;
		onUpdate(next);
		setEditIdx(null);
		setDraft(null);
	};

	const remove = (idx) => {
		if (!window.confirm("Remove this item?")) return;
		onUpdate(items.filter((_, i) => i !== idx));
	};

	const cancel = () => { setEditIdx(null); setDraft(null); };

	return (
		<div className="adm-crud">
			{items.map((item, idx) => (
				<div key={getKey(item, idx)} className="adm-crud__item">
					<div className="adm-crud__row">
						<div className="adm-crud__summary">{renderSummary(item)}</div>
						<div className="adm-crud__btns">
							<button className="adm-btn adm-btn--sm" onClick={() => startEdit(idx)}>Edit</button>
							<button className="adm-btn adm-btn--sm adm-btn--danger" onClick={() => remove(idx)}>Delete</button>
						</div>
					</div>
					{editIdx === idx && (
						<div className="adm-crud__panel">
							{renderForm(draft, setDraft)}
							<div className="adm-crud__panel-actions">
								<button className="adm-btn adm-btn--primary" onClick={commit}>Save item</button>
								<button className="adm-btn" onClick={cancel}>Cancel</button>
							</div>
						</div>
					)}
				</div>
			))}
			{editIdx === -1 && (
				<div className="adm-crud__panel adm-crud__panel--new">
					<div className="adm-crud__panel-label">New item</div>
					{renderForm(draft, setDraft)}
					<div className="adm-crud__panel-actions">
						<button className="adm-btn adm-btn--primary" onClick={commit}>Add item</button>
						<button className="adm-btn" onClick={cancel}>Cancel</button>
					</div>
				</div>
			)}
			{editIdx === null && (
				<button className="adm-btn adm-btn--add" onClick={startAdd}>+ Add item</button>
			)}
		</div>
	);
}

// ── Tab components ───────────────────────────────────────────────

function ProfileTab({ data, onChange }) {
	const set = (key) => (val) => onChange({ ...data, [key]: val });
	const setLink = (key) => (val) => onChange({ ...data, links: { ...data.links, [key]: val } });

	return (
		<div className="adm-section">
			<h2 className="adm-section__title">Profile</h2>
			<div className="adm-grid-2">
				<Field label="Name" id="p-name" value={data.name} onChange={set("name")} />
				<Field label="Role" id="p-role" value={data.role} onChange={set("role")} />
				<Field label="University" id="p-uni" value={data.university} onChange={set("university")} />
				<Field label="Graduation year" id="p-grad" value={data.graduation} onChange={set("graduation")} />
				<Field label="Location" id="p-loc" value={data.location} onChange={set("location")} />
				<Field
					label="Interests (comma-separated)"
					id="p-int"
					value={Array.isArray(data.interests) ? data.interests.join(", ") : (data.interests ?? "")}
					onChange={(v) => onChange({ ...data, interests: v.split(",").map((s) => s.trim()).filter(Boolean) })}
					note="Example: Mobile Development, Full-Stack, AI Systems"
				/>
			</div>
			<Field label="Bio" id="p-bio" value={data.bio} onChange={set("bio")} rows={4} />
			<Field label="Hero headline" id="p-headline" value={data.heroHeadline} onChange={set("heroHeadline")} />
			<Field
				label="Hero standfirst (2–3 sentences)"
				id="p-standfirst"
				value={data.heroStandfirst}
				onChange={set("heroStandfirst")}
				rows={3}
			/>
			<h3 className="adm-section__sub">Links</h3>
			<div className="adm-grid-2">
				<Field label="Email" id="p-email" value={data.links?.email} onChange={setLink("email")} type="email" />
				<Field label="GitHub URL" id="p-github" value={data.links?.github} onChange={setLink("github")} type="url" />
				<Field label="LinkedIn URL" id="p-linkedin" value={data.links?.linkedin} onChange={setLink("linkedin")} type="url" />
				<Field label="CV path" id="p-cv" value={data.links?.cv} onChange={setLink("cv")} placeholder="/cv.pdf" />
			</div>
		</div>
	);
}

const EMPTY_PROJECT = {
	slug: "", category: "", title: "", deck: "",
	featured: false, leadProject: false,
	role: "", timeframe: "", team: "", status: "",
	stack: [], github: "", live: null, screenshot: "",
	sections: { problem: "", investigation: "", implementation: "", whatBroke: "", outcome: "", learned: "" },
};

function ProjectsTab({ data, onChange }) {
	return (
		<div className="adm-section">
			<h2 className="adm-section__title">Projects</h2>
			<CrudList
				items={data}
				onUpdate={onChange}
				getKey={(item, idx) => item.slug || idx}
				renderSummary={(item) => (
					<span>
						<strong>{item.title || "Untitled project"}</strong>
						<span className="adm-meta"> — {item.category || "No category"} · {item.status || "No status"}</span>
						{item.leadProject && <span className="adm-badge">Lead</span>}
						{item.featured && <span className="adm-badge adm-badge--alt">Featured</span>}
					</span>
				)}
				emptyItem={EMPTY_PROJECT}
				renderForm={(draft, setDraft) => {
					const set = (key) => (val) => setDraft((d) => ({ ...d, [key]: val }));
					const setSection = (key) => (val) =>
						setDraft((d) => ({ ...d, sections: { ...d.sections, [key]: val } }));
					return (
						<div>
							<div className="adm-grid-2">
								<Field
									label="Title"
									id="pj-title"
									value={draft.title}
									onChange={(v) => setDraft((d) => ({ ...d, title: v, slug: d.slug || slugify(v) }))}
								/>
								<Field label="Slug" id="pj-slug" value={draft.slug} onChange={set("slug")} note="URL-safe id" />
								<Field label="Category" id="pj-cat" value={draft.category} onChange={set("category")} placeholder="MOBILE ENGINEERING" />
								<Field label="Status" id="pj-status" value={draft.status} onChange={set("status")} placeholder="In development" />
								<Field label="Role" id="pj-role" value={draft.role} onChange={set("role")} />
								<Field label="Timeframe" id="pj-time" value={draft.timeframe} onChange={set("timeframe")} placeholder="Oct 2025 — Present" />
								<Field label="Team" id="pj-team" value={draft.team} onChange={set("team")} />
								<Field
									label="Stack (comma-separated)"
									id="pj-stack"
									value={Array.isArray(draft.stack) ? draft.stack.join(", ") : (draft.stack ?? "")}
									onChange={(v) => setDraft((d) => ({ ...d, stack: v.split(",").map((s) => s.trim()).filter(Boolean) }))}
								/>
								<Field label="GitHub URL" id="pj-github" value={draft.github} onChange={set("github")} />
								<Field
									label="Live URL"
									id="pj-live"
									value={draft.live ?? ""}
									onChange={(v) => setDraft((d) => ({ ...d, live: v || null }))}
								/>
								<Field label="Screenshot path" id="pj-img" value={draft.screenshot} onChange={set("screenshot")} placeholder="/images/projects/name.png" />
							</div>
							<Field label="Deck (one sentence)" id="pj-deck" value={draft.deck} onChange={set("deck")} />
							<div className="adm-checks">
								<Check label="Featured on front page" checked={draft.featured} onChange={(v) => setDraft((d) => ({ ...d, featured: v }))} />
								<Check label="Lead project (largest card)" checked={draft.leadProject} onChange={(v) => setDraft((d) => ({ ...d, leadProject: v }))} />
							</div>
							<h4 className="adm-subsection">Case study sections</h4>
							<Field label="The problem" id="pj-prob" value={draft.sections?.problem} onChange={setSection("problem")} rows={4} />
							<Field label="Investigation" id="pj-inv" value={draft.sections?.investigation} onChange={setSection("investigation")} rows={4} />
							<Field label="Implementation" id="pj-impl" value={draft.sections?.implementation} onChange={setSection("implementation")} rows={5} />
							<Field label="What broke / trade-offs" id="pj-broke" value={draft.sections?.whatBroke} onChange={setSection("whatBroke")} rows={3} />
							<Field label="Outcome" id="pj-out" value={draft.sections?.outcome} onChange={setSection("outcome")} rows={3} />
							<Field label="What I learned" id="pj-learn" value={draft.sections?.learned} onChange={setSection("learned")} rows={3} />
						</div>
					);
				}}
			/>
		</div>
	);
}

const EMPTY_EXPERIENCE = {
	dateRange: "", org: "", role: "", bullets: [], current: false,
};

function ExperienceTab({ data, onChange }) {
	return (
		<div className="adm-section">
			<h2 className="adm-section__title">Experience</h2>
			<p className="adm-help">List in reverse-chronological order. Current roles appear at the top of the Career Desk.</p>
			<CrudList
				items={data}
				onUpdate={onChange}
				getKey={(item, idx) => `${item.org}-${idx}`}
				renderSummary={(item) => (
					<span>
						<strong>{item.role || "Untitled role"}</strong> at {item.org || "—"}
						<span className="adm-meta"> · {item.dateRange}</span>
						{item.current && <span className="adm-badge">Current</span>}
					</span>
				)}
				emptyItem={EMPTY_EXPERIENCE}
				renderForm={(draft, setDraft) => {
					const set = (key) => (val) => setDraft((d) => ({ ...d, [key]: val }));
					return (
						<div>
							<div className="adm-grid-2">
								<Field label="Organisation" id="ex-org" value={draft.org} onChange={set("org")} />
								<Field label="Role / title" id="ex-role" value={draft.role} onChange={set("role")} />
								<Field label="Date range" id="ex-date" value={draft.dateRange} onChange={set("dateRange")} placeholder="Jan 2025 — Present" />
							</div>
							<Field
								label="Bullets (one per line)"
								id="ex-bullets"
								value={Array.isArray(draft.bullets) ? draft.bullets.join("\n") : (draft.bullets ?? "")}
								onChange={(v) => setDraft((d) => ({ ...d, bullets: v.split("\n").map((s) => s.trim()).filter(Boolean) }))}
								rows={5}
								note="Each line becomes a bullet point on the career page"
							/>
							<Check label="Current position" checked={draft.current} onChange={(v) => setDraft((d) => ({ ...d, current: v }))} />
						</div>
					);
				}}
			/>
		</div>
	);
}

const EMPTY_PHILOSOPHY = {
	principle: "", position: "", example: "", projectLink: "",
};

function PhilosophyTab({ data, onChange }) {
	return (
		<div className="adm-section">
			<h2 className="adm-section__title">Engineering Philosophy</h2>
			<p className="adm-help">3–6 sharp principles, each grounded in real experience. Aim for specific over inspirational.</p>
			<CrudList
				items={data}
				onUpdate={onChange}
				getKey={(_, idx) => idx}
				renderSummary={(item) => (
					<span>
						<strong>{item.principle || "New principle"}</strong>
						{item.position && <span className="adm-meta"> — {item.position}</span>}
					</span>
				)}
				emptyItem={EMPTY_PHILOSOPHY}
				renderForm={(draft, setDraft) => {
					const set = (key) => (val) => setDraft((d) => ({ ...d, [key]: val }));
					return (
						<div>
							<Field label="Principle (short bold statement)" id="ph-prin" value={draft.principle} onChange={set("principle")} />
							<Field label="One-sentence position" id="ph-pos" value={draft.position} onChange={set("position")} />
							<Field label="Example in practice" id="ph-ex" value={draft.example} onChange={set("example")} rows={3} />
							<Field label="Related project link" id="ph-link" value={draft.projectLink} onChange={set("projectLink")} placeholder="/work/project-slug" />
						</div>
					);
				}}
			/>
		</div>
	);
}

const EMPTY_NOTE = {
	slug: "", title: "", date: "", topic: "", readTime: "", body: "",
};

function FieldNotesTab({ data, onChange }) {
	return (
		<div className="adm-section">
			<h2 className="adm-section__title">Field Notes</h2>
			<p className="adm-help">Technical notes, build logs, debugging postmortems. Body supports Markdown.</p>
			<CrudList
				items={data}
				onUpdate={onChange}
				getKey={(item, idx) => item.slug || idx}
				renderSummary={(item) => (
					<span>
						<strong>{item.title || "Untitled note"}</strong>
						<span className="adm-meta"> · {item.date} · {item.topic} · {item.readTime}</span>
					</span>
				)}
				emptyItem={EMPTY_NOTE}
				renderForm={(draft, setDraft) => {
					const set = (key) => (val) => setDraft((d) => ({ ...d, [key]: val }));
					return (
						<div>
							<div className="adm-grid-2">
								<Field
									label="Title"
									id="fn-title"
									value={draft.title}
									onChange={(v) => setDraft((d) => ({ ...d, title: v, slug: d.slug || slugify(v) }))}
								/>
								<Field label="Slug" id="fn-slug" value={draft.slug} onChange={set("slug")} />
								<Field label="Date" id="fn-date" value={draft.date} onChange={set("date")} type="date" />
								<Field label="Topic" id="fn-topic" value={draft.topic} onChange={set("topic")} />
								<Field label="Read time" id="fn-read" value={draft.readTime} onChange={set("readTime")} placeholder="4 min" />
							</div>
							<Field label="Body (Markdown)" id="fn-body" value={draft.body} onChange={set("body")} rows={20} note="Supports Markdown" />
						</div>
					);
				}}
			/>
		</div>
	);
}

function CurrentFocusTab({ data, onChange }) {
	const set = (key) => (val) => onChange({ ...data, [key]: val });
	return (
		<div className="adm-section">
			<h2 className="adm-section__title">Current Focus</h2>
			<p className="adm-help">A dated snapshot of what is on the desk right now. Keep it honest and factual — an old panel is worse than none.</p>
			<Field label="Date (month and year)" id="cf-date" value={data.date} onChange={set("date")} placeholder="September 2026" />
			<Field label="Building" id="cf-building" value={data.building} onChange={set("building")} rows={2} />
			<Field label="Learning" id="cf-learning" value={data.learning} onChange={set("learning")} rows={2} />
			<Field label="Exploring" id="cf-exploring" value={data.exploring} onChange={set("exploring")} rows={2} />
		</div>
	);
}

function MetaTab({ data, onChange }) {
	const set = (key) => (val) => onChange({ ...data, [key]: val });
	return (
		<div className="adm-section">
			<h2 className="adm-section__title">Meta</h2>
			<p className="adm-help">lastUpdated is automatically set to now on every save.</p>
			<div className="adm-grid-2">
				<Field label="Schema version" id="m-ver" value={data.version} onChange={set("version")} />
				<Field label="Edition label" id="m-ed" value={data.editionLabel} onChange={set("editionLabel")} placeholder="Edition No. 02" />
				<Field label="Last updated (ISO 8601)" id="m-upd" value={data.lastUpdated} onChange={set("lastUpdated")} />
			</div>
		</div>
	);
}

// ── Main Dashboard ───────────────────────────────────────────────

const TABS = [
	{ id: "profile", label: "Profile" },
	{ id: "projects", label: "Projects" },
	{ id: "experience", label: "Experience" },
	{ id: "philosophy", label: "Philosophy" },
	{ id: "fieldNotes", label: "Field Notes" },
	{ id: "currentFocus", label: "Current Focus" },
	{ id: "meta", label: "Meta" },
];

export default function AdminDashboard() {
	const [activeTab, setActiveTab] = useState("profile");
	const [formData, setFormData] = useState(null);
	const [saving, setSaving] = useState(false);
	const [saveStatus, setSaveStatus] = useState(null); // 'ok' | 'error' | null

	const { data } = usePortfolioData();
	const { isAuthenticated, logout, authHeaders } = useAdmin();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isAuthenticated) navigate("/admin");
	}, [isAuthenticated, navigate]);

	// Seed form from portfolio data (once)
	useEffect(() => {
		if (data && !formData) setFormData(deepClone(data));
	}, [data, formData]);

	const update = (key) => (val) => setFormData((prev) => ({ ...prev, [key]: val }));

	const save = async () => {
		setSaving(true);
		setSaveStatus(null);
		const payload = {
			...formData,
			meta: { ...formData.meta, lastUpdated: new Date().toISOString() },
		};
		try {
			const res = await fetch("/api/admin/update", {
				method: "POST",
				headers: { "Content-Type": "application/json", ...authHeaders },
				body: JSON.stringify(payload),
			});
			setSaveStatus(res.ok ? "ok" : "error");
			if (res.ok) setFormData(payload);
		} catch {
			setSaveStatus("error");
		} finally {
			setSaving(false);
			setTimeout(() => setSaveStatus(null), 5000);
		}
	};

	const renderTab = () => {
		if (!formData) return <p className="adm-loading">Loading content…</p>;
		switch (activeTab) {
			case "profile":      return <ProfileTab      data={formData.profile}      onChange={update("profile")} />;
			case "projects":     return <ProjectsTab     data={formData.projects}     onChange={update("projects")} />;
			case "experience":   return <ExperienceTab   data={formData.experience}   onChange={update("experience")} />;
			case "philosophy":   return <PhilosophyTab   data={formData.philosophy}   onChange={update("philosophy")} />;
			case "fieldNotes":   return <FieldNotesTab   data={formData.fieldNotes}   onChange={update("fieldNotes")} />;
			case "currentFocus": return <CurrentFocusTab data={formData.currentFocus} onChange={update("currentFocus")} />;
			case "meta":         return <MetaTab         data={formData.meta}         onChange={update("meta")} />;
			default: return null;
		}
	};

	return (
		<div className="adm">
			<header className="adm__header">
				<span className="adm__brand">FINNXIII.DEV Admin</span>
				<div className="adm__header-actions">
					<a className="adm-btn" href="/" target="_blank" rel="noopener noreferrer">
						View site ↗
					</a>
					<button className="adm-btn" onClick={logout}>Sign out</button>
				</div>
			</header>

			<div className="adm__tabs" role="tablist">
				{TABS.map(({ id, label }) => (
					<button
						key={id}
						role="tab"
						aria-selected={activeTab === id}
						className={`adm__tab${activeTab === id ? " adm__tab--active" : ""}`}
						onClick={() => setActiveTab(id)}
					>
						{label}
					</button>
				))}
			</div>

			<main className="adm__content">
				{renderTab()}
			</main>

			<div className="adm__save-bar">
				<button
					className="adm-btn adm-btn--primary adm-btn--lg"
					onClick={save}
					disabled={saving}
				>
					{saving ? "Saving…" : "Save all changes"}
				</button>
				{saveStatus === "ok" && (
					<span className="adm-status adm-status--ok">Saved successfully ✓</span>
				)}
				{saveStatus === "error" && (
					<span className="adm-status adm-status--error">Save failed — check authentication</span>
				)}
			</div>
		</div>
	);
}

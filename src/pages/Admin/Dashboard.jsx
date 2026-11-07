import { useState, useEffect, useCallback } from "react";
import { validateContent } from "../../content/schema";

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
	const setAvail = (key) => (val) => onChange({ ...data, availability: { ...(data.availability ?? {}), [key]: val } });

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
				<Field label="CV path" id="p-cv" value={data.links?.cv} onChange={setLink("cv")} placeholder="/NaingHtooLwin-CV.pdf" />
			</div>
			<h3 className="adm-section__sub">Availability (masthead ear)</h3>
			<p className="adm-help">Leave status blank to hide the availability ear and fall back to "Now Building".</p>
			<div className="adm-grid-2">
				<Field label="Status (e.g. Open to placements)" id="p-av-status" value={data.availability?.status} onChange={setAvail("status")} />
				<Field label="CTA label (e.g. Download CV)" id="p-av-cta" value={data.availability?.cta} onChange={setAvail("cta")} />
				<Field label="CTA href (e.g. /cv.pdf)" id="p-av-href" value={data.availability?.href} onChange={setAvail("href")} placeholder="/NaingHtooLwin-CV.pdf" />
			</div>
			<Field label="Detail (italic line below status)" id="p-av-detail" value={data.availability?.detail} onChange={setAvail("detail")} />
		</div>
	);
}

const EMPTY_PROJECT = {
	slug: "", category: "", title: "", deck: "",
	featured: false, leadProject: false,
	role: "", timeframe: "", team: "", status: "",
	stack: [], github: "", live: null, screenshot: "", figureCaption: "",
	pullQuote: "", relatedNote: "", numbers: [],
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
								<Field label="Related field note (slug)" id="pj-related" value={draft.relatedNote ?? ""} onChange={set("relatedNote")} placeholder="timescaledb-gotchas" note="Shown as a sidenote on the case study page" />
							</div>
							<Field label="Deck (one sentence)" id="pj-deck" value={draft.deck} onChange={set("deck")} />
							<Field
								label="Pull quote (optional, shown on front page lead)"
								id="pj-pullquote"
								value={draft.pullQuote ?? ""}
								onChange={set("pullQuote")}
								note="Short punchy sentence from the case study"
							/>
							<Field
								label="By the numbers (value | label, one per line)"
								id="pj-numbers"
								value={
									Array.isArray(draft.numbers)
										? draft.numbers.map((n) => `${n.value} | ${n.label}`).join("\n")
										: ""
								}
								onChange={(v) =>
									setDraft((d) => ({
										...d,
										numbers: v
											.split("\n")
											.map((s) => s.trim())
											.filter(Boolean)
											.map((s) => {
												const pipe = s.indexOf("|");
												if (pipe === -1) return { value: s.trim(), label: "" };
												return { value: s.slice(0, pipe).trim(), label: s.slice(pipe + 1).trim() };
											}),
									}))
								}
								rows={4}
								note="Example: 0–100 | bot score per request"
							/>
							<Field
								label="Figure caption"
								id="pj-fig"
								value={draft.figureCaption ?? ""}
								onChange={set("figureCaption")}
								placeholder="Fig. 1 — Short description of the diagram."
								note="Shown below the inline diagram on the case study page"
							/>
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
			<p className="adm-help">List in reverse-chronological order. Current roles appear at the top of the Experience section.</p>
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
	slug: "", title: "", date: "", topic: "", readTime: "", deck: "", relatedProject: "", body: "",
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
								<Field label="Deck (one sentence)" id="fn-deck" value={draft.deck ?? ""} onChange={set("deck")} placeholder="One sentence summarising the note." />
								<Field label="Related project (slug)" id="fn-rel" value={draft.relatedProject ?? ""} onChange={set("relatedProject")} placeholder="vigil" />
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
			<div className="adm-grid-2">
				<Field label="Building (short)" id="cf-bshort" value={data.buildingShort ?? ""} onChange={set("buildingShort")} placeholder="Vigil" />
				<Field label="Learning (short)" id="cf-lshort" value={data.learningShort ?? ""} onChange={set("learningShort")} placeholder="Mobile development" />
				<Field label="Exploring (short)" id="cf-eshort" value={data.exploringShort ?? ""} onChange={set("exploringShort")} placeholder="VR & IoT" />
				<Field label="Building link (optional slug)" id="cf-blink" value={data.buildingLink ?? ""} onChange={set("buildingLink")} placeholder="/work/vigil" />
			</div>
			<Field label="Building" id="cf-building" value={data.building} onChange={set("building")} rows={3} />
			<Field label="Learning" id="cf-learning" value={data.learning} onChange={set("learning")} rows={3} />
			<Field label="Exploring" id="cf-exploring" value={data.exploring} onChange={set("exploring")} rows={3} />
		</div>
	);
}

function MetaTab({ data, onChange }) {
	const set = (key) => (val) => onChange({ ...data, [key]: val });
	return (
		<div className="adm-section">
			<h2 className="adm-section__title">Meta</h2>
			<p className="adm-help">lastUpdated is set automatically to now on every save.</p>
			<div className="adm-grid-2">
				<Field label="Schema version" id="m-ver" value={data.version} onChange={set("version")} />
				<Field label="Edition label" id="m-ed" value={data.editionLabel} onChange={set("editionLabel")} placeholder="Edition No. 02" />
				<Field label="Last updated (ISO 8601)" id="m-upd" value={data.lastUpdated} onChange={set("lastUpdated")} />
			</div>
		</div>
	);
}

function HistoryTab({ history, restoring, onRestore, deployStatus, lastCommitSha }) {
	const deployState =
		!deployStatus || !lastCommitSha
			? null
			: deployStatus.status === "completed"
				? deployStatus.conclusion === "success"
					? "ok"
					: "fail"
				: "pending";

	return (
		<div className="adm-section">
			<h2 className="adm-section__title">Commit History</h2>
			{deployState && (
				<div className={`adm-deploy adm-deploy--${deployState}`}>
					{deployState === "ok" && "Deploy succeeded ✓"}
					{deployState === "fail" && `Deploy failed — ${deployStatus.conclusion}`}
					{deployState === "pending" && "Deploy in progress…"}
					{deployStatus.url && (
						<> · <a href={deployStatus.url} target="_blank" rel="noopener noreferrer">View run ↗</a></>
					)}
				</div>
			)}
			{history.length === 0 ? (
				<p className="adm-help">No history loaded.</p>
			) : (
				<ul className="adm-history">
					{history.map((commit) => (
						<li key={commit.sha} className="adm-history__item">
							<div className="adm-history__meta">
								<code className="adm-history__sha">
									<a href={commit.url} target="_blank" rel="noopener noreferrer">
										{commit.sha.slice(0, 7)}
									</a>
								</code>
								<span className="adm-history__date">
									{new Date(commit.date).toLocaleString()}
								</span>
							</div>
							<div className="adm-history__msg">{commit.message}</div>
							<button
								className="adm-btn adm-btn--sm"
								onClick={() => onRestore(commit.sha)}
								disabled={Boolean(restoring)}
							>
								{restoring === commit.sha ? "Restoring…" : "Restore"}
							</button>
						</li>
					))}
				</ul>
			)}
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
	{ id: "history", label: "History" },
];

export default function AdminDashboard() {
	const [activeTab, setActiveTab] = useState("profile");
	const [formData, setFormData] = useState(null);
	const [sha, setSha] = useState(null);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState(null);
	const [saving, setSaving] = useState(false);
	const [saveStatus, setSaveStatus] = useState(null); // 'ok' | 'error' | 'conflict' | 'invalid'
	const [saveErrors, setSaveErrors] = useState([]);
	const [commitMessage, setCommitMessage] = useState("");
	const [history, setHistory] = useState([]);
	const [restoring, setRestoring] = useState(null);
	const [deployStatus, setDeployStatus] = useState(null);
	const [lastCommitSha, setLastCommitSha] = useState(null);

	const loadContent = useCallback(async () => {
		setLoading(true);
		setLoadError(null);
		try {
			const res = await fetch("/api/admin/content", { headers: { "Cache-Control": "no-store" } });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const { content, sha: newSha } = await res.json();
			setSha(newSha);
			setFormData(JSON.parse(content));
		} catch (err) {
			setLoadError(`Failed to load content: ${err.message}`);
		} finally {
			setLoading(false);
		}
	}, []);

	const loadHistory = useCallback(async () => {
		try {
			const res = await fetch("/api/admin/history");
			if (!res.ok) return;
			setHistory(await res.json());
		} catch { /* non-fatal */ }
	}, []);

	useEffect(() => {
		loadContent();
		loadHistory();
	}, [loadContent, loadHistory]);

	const update = (key) => (val) => setFormData((prev) => ({ ...prev, [key]: val }));

	const pollDeployStatus = async (commitSha) => {
		setDeployStatus({ status: "queued", conclusion: null, url: null });
		for (let i = 0; i < 8; i++) {
			await new Promise((r) => setTimeout(r, 15000));
			try {
				const res = await fetch(`/api/admin/deploy-status?sha=${commitSha}`);
				if (!res.ok) continue;
				const data = await res.json();
				setDeployStatus(data);
				if (data.status === "completed") break;
			} catch { break; }
		}
	};

	const save = async () => {
		if (!commitMessage.trim()) {
			setSaveStatus("error");
			setSaveErrors([{ path: "", message: "A commit message is required." }]);
			return;
		}

		const payload = {
			...formData,
			meta: { ...formData.meta, lastUpdated: new Date().toISOString() },
		};

		const validation = validateContent(payload);
		if (!validation.ok) {
			setSaveStatus("invalid");
			setSaveErrors(validation.errors);
			return;
		}

		setSaving(true);
		setSaveStatus(null);
		setSaveErrors([]);

		try {
			const res = await fetch("/api/admin/content", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					content: JSON.stringify(payload, null, "\t") + "\n",
					sha,
					message: commitMessage.trim(),
				}),
			});

			if (res.status === 409) {
				setSaveStatus("conflict");
				return;
			}
			if (res.status === 422) {
				const data = await res.json();
				setSaveStatus("invalid");
				setSaveErrors(data.errors ?? []);
				return;
			}
			if (!res.ok) {
				setSaveStatus("error");
				setSaveErrors([{ path: "", message: "Save failed. Try again." }]);
				return;
			}

			const { commitSha } = await res.json();
			setSaveStatus("ok");
			setFormData(payload);
			setCommitMessage("");
			setLastCommitSha(commitSha);
			loadHistory();
			setTimeout(() => setSaveStatus((s) => (s === "ok" ? null : s)), 8000);
			pollDeployStatus(commitSha);
		} catch {
			setSaveStatus("error");
			setSaveErrors([{ path: "", message: "Network error. Try again." }]);
		} finally {
			setSaving(false);
		}
	};

	const restore = async (commitSha) => {
		if (!window.confirm(`Restore content from ${commitSha.slice(0, 7)}? This will create a new commit.`)) return;
		setRestoring(commitSha);
		try {
			const res = await fetch("/api/admin/restore", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ commitSha }),
			});
			if (!res.ok) { alert("Restore failed."); return; }
			await loadContent();
			await loadHistory();
		} catch {
			alert("Restore failed.");
		} finally {
			setRestoring(null);
		}
	};

	const renderTab = () => {
		if (loading) return <p className="adm-loading">Loading content from GitHub…</p>;
		if (loadError) return (
			<div className="adm-load-error">
				<p className="adm-error">{loadError}</p>
				<button className="adm-btn" onClick={loadContent}>Retry</button>
			</div>
		);
		if (!formData) return null;

		switch (activeTab) {
			case "profile":      return <ProfileTab      data={formData.profile}      onChange={update("profile")} />;
			case "projects":     return <ProjectsTab     data={formData.projects}     onChange={update("projects")} />;
			case "experience":   return <ExperienceTab   data={formData.experience}   onChange={update("experience")} />;
			case "philosophy":   return <PhilosophyTab   data={formData.philosophy}   onChange={update("philosophy")} />;
			case "fieldNotes":   return <FieldNotesTab   data={formData.fieldNotes}   onChange={update("fieldNotes")} />;
			case "currentFocus": return <CurrentFocusTab data={formData.currentFocus} onChange={update("currentFocus")} />;
			case "meta":         return <MetaTab         data={formData.meta}         onChange={update("meta")} />;
			case "history":      return <HistoryTab      history={history} restoring={restoring} onRestore={restore} deployStatus={deployStatus} lastCommitSha={lastCommitSha} />;
			default: return null;
		}
	};

	return (
		<>
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
				<input
					className="adm-input adm-save-msg"
					type="text"
					placeholder="Describe the change (required for commit)"
					value={commitMessage}
					onChange={(e) => setCommitMessage(e.target.value)}
					onKeyDown={(e) => { if (e.key === "Enter" && !saving && formData && commitMessage.trim()) save(); }}
					disabled={saving || !formData}
					aria-label="Commit message"
				/>
				<button
					className="adm-btn adm-btn--primary adm-btn--lg"
					onClick={save}
					disabled={saving || !formData || !commitMessage.trim()}
				>
					{saving ? "Saving…" : "Save & commit"}
				</button>
				{saveStatus === "ok" && (
					<span className="adm-status adm-status--ok">Saved ✓</span>
				)}
				{saveStatus === "error" && (
					<span className="adm-status adm-status--error">
						{saveErrors[0]?.message ?? "Save failed"}
					</span>
				)}
				{saveStatus === "conflict" && (
					<span className="adm-status adm-status--error">
						Content changed —{" "}
						<button className="adm-btn adm-btn--sm" onClick={loadContent}>
							Reload from GitHub
						</button>
					</span>
				)}
				{saveStatus === "invalid" && (
					<span className="adm-status adm-status--error">
						{saveErrors.length} validation error{saveErrors.length !== 1 ? "s" : ""}
					</span>
				)}
			</div>
		</>
	);
}

import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useCvStagedCtx } from "./useCvStagedCtx";
import { useQuack } from "../../components/quack/QuackContext";

// Worker URL resolved by Vite at build time — cheap import, just a string
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

const PDF_MAX = 5 * 1024 * 1024;
const IDEAL_NAME = "NaingHtooLwin-CV.pdf";

// ---- Lazy pdfjs singleton ----
let _pdfjs = null;
async function getPdfJs() {
	if (_pdfjs) return _pdfjs;
	const lib = await import("pdfjs-dist");
	lib.GlobalWorkerOptions.workerSrc = workerSrc;
	_pdfjs = lib;
	return lib;
}

async function renderToCanvas(canvas, source, page, widthPx = 240) {
	try {
		const lib = await getPdfJs();
		const data = source instanceof Blob ? await source.arrayBuffer() : source;
		const doc = await lib.getDocument({ data }).promise;
		const pg = await doc.getPage(page);
		const vp0 = pg.getViewport({ scale: 1 });
		const scale = widthPx / vp0.width;
		const vp = pg.getViewport({ scale });
		canvas.width = vp.width;
		canvas.height = vp.height;
		await pg.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
		return doc.numPages;
	} catch {
		return null;
	}
}

// ---- Client-side PDF validation ----
async function validatePdfFile(file) {
	if (!file) return "No file selected.";
	if (file.size === 0) return "File is empty.";
	if (file.size > PDF_MAX) return `File is ${(file.size / 1024 / 1024).toFixed(1)} MB — must be under 5 MB.`;
	const slice = await file.slice(0, 5).arrayBuffer();
	const bytes = new Uint8Array(slice);
	const isPdf = bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2D;
	if (!isPdf) return "File must be a PDF (doesn't start with %PDF-).";
	return null;
}

// ---- Paper mock (fallback thumbnail) ----
function PaperMock({ dim = 0.5 }) {
	return (
		<div className="adm-cv-paper-mock" style={{ opacity: dim ? 0.5 : 1 }} aria-hidden="true">
			{Array.from({ length: 14 }, (_, i) => (
				<i key={i} className={
					"adm-cv-paper__line" +
					(i === 0 ? " adm-cv-paper__line--title" : "") +
					(i === 2 ? " adm-cv-paper__line--rule" : "")
				} />
			))}
		</div>
	);
}

export default function AdminCV() {
	const { cvStaged, stageCv, unstageCv } = useCvStagedCtx();
	const { setQuips } = useQuack();

	const [pending, setPending] = useState(null); // { file: File, error: string|null }
	const [pendingPages, setPendingPages] = useState(null);
	const [pendingPage, setPendingPage] = useState(1);
	const [livePages, setLivePages] = useState(null);
	const [livePage, setLivePage] = useState(1);
	const [isDragging, setIsDragging] = useState(false);
	const [note, setNote] = useState("");
	const [noteError, setNoteError] = useState(null);
	const [staging, setStaging] = useState(false);
	const [history, setHistory] = useState(null);
	const [histLoading, setHistLoading] = useState(true);
	const [versionExpanded, setVersionExpanded] = useState(null); // sha of expanded version
	const [versionNote, setVersionNote] = useState("");
	const [fetchingVersion, setFetchingVersion] = useState(null);

	const liveCanvasRef = useRef(null);
	const pendingCanvasRef = useRef(null);
	const fileInputRef = useRef(null);

	// Quack quips
	useEffect(() => {
		setQuips(
			cvStaged
				? ["CV staged. It's not live until you publish."]
				: ["PDFs only. I can't read Word documents. Or anything."],
		);
	}, [cvStaged, setQuips]);

	// Fetch history
	useEffect(() => {
		fetch("/api/admin/cv/history")
			.then((r) => r.ok ? r.json() : null)
			.then((d) => { if (d) setHistory(d); })
			.catch(() => {})
			.finally(() => setHistLoading(false));
	}, []);

	// Render live PDF on mount (or when staged changes)
	useEffect(() => {
		const canvas = liveCanvasRef.current;
		if (!canvas) return;
		let cancelled = false;

		fetch("/api/admin/cv/file")
			.then((r) => r.ok ? r.arrayBuffer() : null)
			.then(async (buf) => {
				if (cancelled || !buf) return;
				const n = await renderToCanvas(canvas, buf, livePage, 240);
				if (!cancelled && n) setLivePages(n);
			})
			.catch(() => {});

		return () => { cancelled = true; };
	}, [livePage]);

	// Render pending PDF when file or page changes
	useEffect(() => {
		if (!pending?.file || pending.error) return;
		const canvas = pendingCanvasRef.current;
		if (!canvas) return;
		let cancelled = false;

		(async () => {
			const n = await renderToCanvas(canvas, pending.file, pendingPage, 240);
			if (!cancelled && n) setPendingPages(n);
		})();

		return () => { cancelled = true; };
	}, [pending, pendingPage]);

	const processFile = useCallback(async (file) => {
		const error = await validatePdfFile(file);
		setPending({ file, error });
		setPendingPage(1);
		setPendingPages(null);
		setNote("");
		setNoteError(null);
	}, []);

	const handleDrop = useCallback(async (e) => {
		e.preventDefault();
		setIsDragging(false);
		const file = e.dataTransfer.files[0];
		if (!file) return;
		await processFile(file);
	}, [processFile]);

	const handleDragOver = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
	const handleDragLeave = useCallback(() => setIsDragging(false), []);

	const handleFileInput = useCallback(async (e) => {
		const file = e.target.files[0];
		if (!file) return;
		await processFile(file);
		e.target.value = "";
	}, [processFile]);

	const handleStage = useCallback(async () => {
		if (!pending?.file || pending.error) return;
		if (!note.trim()) { setNoteError("Please describe what changed."); return; }
		setNoteError(null);
		setStaging(true);
		try {
			const lib = await getPdfJs();
			const data = await pending.file.arrayBuffer();
			const doc = await lib.getDocument({ data }).promise;
			const pages = doc.numPages;
			await stageCv({
				blob: pending.file,
				filename: pending.file.name,
				size: pending.file.size,
				pages,
				note: note.trim(),
			});
			setPending(null);
		} catch {
			setNoteError("Failed to stage CV. Try again.");
		} finally {
			setStaging(false);
		}
	}, [pending, note, stageCv]);

	const handleUnstage = useCallback(async () => {
		await unstageCv();
		setPending(null);
	}, [unstageCv]);

	const handleVersionExpand = useCallback((sha) => {
		setVersionExpanded((prev) => prev === sha ? null : sha);
		setVersionNote("");
	}, []);

	const handleStageVersion = useCallback(async (sha) => {
		if (!versionNote.trim()) return;
		setFetchingVersion(sha);
		try {
			const res = await fetch(`/api/admin/cv/file?ref=${sha}`);
			if (!res.ok) throw new Error("Failed to fetch");
			const buf = await res.arrayBuffer();
			const blob = new Blob([buf], { type: "application/pdf" });

			const lib = await getPdfJs();
			const doc = await lib.getDocument({ data: buf }).promise;
			const pages = doc.numPages;

			await stageCv({ blob, filename: IDEAL_NAME, size: buf.byteLength, pages, note: versionNote.trim() });
			setVersionExpanded(null);
			setVersionNote("");
		} catch {
			// leave expanded, user can retry
		} finally {
			setFetchingVersion(null);
		}
	}, [versionNote, stageCv]);

	const checksFor = pending?.file && !pending.error ? pending.file : cvStaged ? { name: cvStaged.filename, size: cvStaged.size, pages: cvStaged.pages } : null;

	const checks = checksFor ? [
		{ label: "PDF document", pass: true },
		{ label: `Size: ${(checksFor.size / 1024).toFixed(0)} KB`, pass: checksFor.size <= PDF_MAX },
		{ label: `${checksFor.pages ?? "?"} pages`, pass: checksFor.pages != null },
		{
			label: checksFor.name === IDEAL_NAME ? IDEAL_NAME : `Rename to ${IDEAL_NAME}`,
			pass: checksFor.name === IDEAL_NAME,
		},
	] : [];

	const canStage = pending?.file && !pending.error && note.trim().length > 0 && !staging;

	return (
		<div className="adm-wrap">
			<div className="adm-ov-head">
				<div>
					<span className="adm-ov-head__label">cv.pdf</span>
					<h1 className="adm-ov-head__h1">CV</h1>
				</div>
				{cvStaged && (
					<span className="adm-cv-staged-badge">
						Staged
					</span>
				)}
			</div>

			<div className="adm-cv-layout">
				{/* Left: drop zone + preview */}
				<div className="adm-cv-main">
					{/* Drop zone (hidden when CV is staged and no pending) */}
					{!cvStaged && (
						<div
							className={"adm-card adm-cv-drop" + (isDragging ? " adm-cv-drop--active" : "")}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
							role="region"
							aria-label="CV drop zone"
						>
							<svg className="adm-cv-drop__icon" width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
								<rect x="8" y="4" width="24" height="32" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
								<path d="M14 14h12M14 20h12M14 26h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
								<path d="M20 2v8M17 7l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
							{pending?.file ? (
								<div className="adm-cv-drop__file-info">
									<span className="adm-cv-drop__filename">{pending.file.name}</span>
									<span className="adm-cv-drop__filesize">{(pending.file.size / 1024).toFixed(0)} KB</span>
								</div>
							) : (
								<>
									<span className="adm-cv-drop__title">Drop your new CV here</span>
									<span className="adm-cv-drop__hint">PDF · 5 MB max</span>
								</>
							)}
							{pending?.error && (
								<p className="adm-cv-drop__error" role="alert">{pending.error}</p>
							)}
							<label className="adm-cv-drop__btn">
								{pending?.file ? "Replace file" : "Choose PDF"}
								<input
									ref={fileInputRef}
									type="file"
									accept="application/pdf"
									onChange={handleFileInput}
									className="ae-sr"
								/>
							</label>
						</div>
					)}

					{/* Preview card */}
					{(pending?.file || cvStaged) && (
						<div className="adm-card adm-cv-preview-card">
							<h2 className="adm-cv-preview-card__h2">Preview</h2>
							<div className="adm-cv-preview">
								<div className="adm-cv-preview__side">
									<span className="adm-cv-preview__label">live now</span>
									<div className="adm-cv-preview__canvas-wrap">
										<canvas ref={liveCanvasRef} className="adm-cv-preview__canvas" />
										{!livePages && <PaperMock dim />}
									</div>
									{livePages && livePages > 1 && (
										<div className="adm-cv-preview__pages">
											{Array.from({ length: livePages }, (_, i) => (
												<button key={i + 1}
													type="button"
													className={"adm-cv-preview__pg" + (livePage === i + 1 ? " adm-cv-preview__pg--on" : "")}
													onClick={() => setLivePage(i + 1)}>
													p.{i + 1}
												</button>
											))}
										</div>
									)}
									<a href="/api/admin/cv/file" target="_blank" rel="noopener noreferrer" className="adm-cv-preview__link">
										open full PDF ↗
									</a>
								</div>

								{(pending?.file || cvStaged) && (
									<div className="adm-cv-preview__side">
										<span className="adm-cv-preview__label" style={{ color: "var(--amber-text)" }}>
											{cvStaged ? "staged" : "new upload"}
										</span>
										<div className="adm-cv-preview__canvas-wrap">
											{pending?.file && !pending.error
												? <canvas ref={pendingCanvasRef} className="adm-cv-preview__canvas" />
												: cvStaged
													? <PaperMock />
													: null
											}
											{pending?.file && !pending.error && !pendingPages && <PaperMock />}
										</div>
										{pendingPages && pendingPages > 1 && (
											<div className="adm-cv-preview__pages">
												{Array.from({ length: pendingPages }, (_, i) => (
													<button key={i + 1}
														type="button"
														className={"adm-cv-preview__pg" + (pendingPage === i + 1 ? " adm-cv-preview__pg--on" : "")}
														onClick={() => setPendingPage(i + 1)}>
														p.{i + 1}
													</button>
												))}
											</div>
										)}
										{cvStaged && (
											<span className="adm-cv-preview__note">"{cvStaged.note}"</span>
										)}
									</div>
								)}
							</div>
						</div>
					)}
				</div>

				{/* Right: checks + staging + versions */}
				<aside className="adm-cv-side">
					{/* Checks */}
					{checks.length > 0 && (
						<div className="adm-card adm-cv-checks">
							<h2 className="adm-card__label">checks</h2>
							<ul className="adm-cv-checks__list">
								{checks.map((c, i) => (
									<li key={i} className={"adm-cv-check adm-cv-check--" + (c.pass ? "pass" : "fail")}>
										<span className="adm-cv-check__icon" aria-hidden="true">{c.pass ? "✓" : "✗"}</span>
										<span>{c.label}</span>
									</li>
								))}
							</ul>
						</div>
					)}

					{/* Staging box */}
					{cvStaged ? (
						<div className="adm-card adm-cv-staged-box">
							<span className="adm-cv-staged-box__title">Staged, not live yet.</span>
							<span className="adm-cv-staged-box__note">"{cvStaged.note}"</span>
							<span className="adm-cv-staged-box__meta">
								{(cvStaged.size / 1024).toFixed(0)} KB
								{cvStaged.pages ? ` · ${cvStaged.pages} page${cvStaged.pages !== 1 ? "s" : ""}` : ""}
								{" · PDF"}
							</span>
							<Link to="/admin/publish" className="adm-cv-staged-box__pub">
								Review &amp; publish →
							</Link>
							<button type="button" className="ae-btn" onClick={handleUnstage}>
								Unstage
							</button>
						</div>
					) : (
						<div className="adm-card adm-cv-stage">
							<label className="ae-field">
								<span className="ae-label">What changed?</span>
								<textarea
									className={"ae-input ae-input--ta" + (noteError ? " ae-input--err" : "")}
									value={note}
									onChange={(e) => setNote(e.target.value)}
									maxLength={200}
									rows={3}
									placeholder="e.g. Added demonstrator role"
									disabled={!pending?.file || !!pending.error}
								/>
								<span className="adm-cv-stage__count">{note.length}/200</span>
							</label>
							{noteError && <p className="ae-error" role="alert">{noteError}</p>}
							<button
								type="button"
								className="ae-changes__stage"
								onClick={handleStage}
								disabled={!canStage}
							>
								{staging ? "Staging…" : "Stage for review"}
							</button>
						</div>
					)}

					{/* Versions */}
					<div className="adm-card adm-cv-history">
						<h2 className="adm-card__label">versions</h2>
						{histLoading && <p className="adm-loading">Loading…</p>}
						{history && history.length === 0 && (
							<p className="adm-note">No previous CV commits.</p>
						)}
						{history && history.map((v) => (
							<div key={v.sha} className="adm-cv-version">
								<div className="adm-cv-version__info">
									<span className="adm-cv-version__msg">{v.message}</span>
									{v.note && <span className="adm-cv-version__note">"{v.note}"</span>}
									<span className="adm-cv-version__date">
										{new Date(v.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
									</span>
								</div>
								<button
									type="button"
									className="ae-btn ae-btn--sm"
									onClick={() => handleVersionExpand(v.sha)}
								>
									{versionExpanded === v.sha ? "Cancel" : "Stage this"}
								</button>
								{versionExpanded === v.sha && (
									<div className="adm-cv-version__stage">
										<textarea
											className="ae-input ae-input--ta"
											value={versionNote}
											onChange={(e) => setVersionNote(e.target.value)}
											maxLength={200}
											rows={2}
											placeholder="Why are you restoring this version?"
										/>
										<button
											type="button"
											className="ae-changes__stage"
											onClick={() => handleStageVersion(v.sha)}
											disabled={!versionNote.trim() || fetchingVersion === v.sha}
										>
											{fetchingVersion === v.sha ? "Fetching…" : "Stage"}
										</button>
									</div>
								)}
							</div>
						))}
					</div>
				</aside>
			</div>
		</div>
	);
}

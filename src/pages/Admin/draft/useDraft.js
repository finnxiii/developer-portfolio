import { useState, useCallback, useEffect } from "react";

const LS_KEY = "adm_draft_v2";

function tryStore(data) {
	try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

function tryLoad() {
	try { return JSON.parse(localStorage.getItem(LS_KEY)); } catch { return null; }
}

export function useDraft() {
	const [base, setBase] = useState(null);
	const [baseSha, setBaseSha] = useState(null);
	const [draft, setDraft] = useState(null);
	const [staged, setStaged] = useState(() => new Set());
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState(null);
	const [conflict, setConflict] = useState(false);

	const doLoad = useCallback(async () => {
		setLoading(true);
		setLoadError(null);
		try {
			const res = await fetch("/api/admin/content", {
				headers: { "Cache-Control": "no-store" },
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const { content, sha } = await res.json();
			const parsed = JSON.parse(content);
			setBase(parsed);
			setBaseSha(sha);

			const saved = tryLoad();
			if (saved?.baseSha === sha && saved?.draft) {
				setDraft(saved.draft);
				setStaged(new Set(Array.isArray(saved.staged) ? saved.staged : []));
			} else if (saved?.baseSha && saved.baseSha !== sha && saved?.draft) {
				setConflict(true);
				setDraft(saved.draft);
				setStaged(new Set(Array.isArray(saved.staged) ? saved.staged : []));
			} else {
				setDraft(parsed);
				setStaged(new Set());
			}
		} catch (err) {
			setLoadError(`Failed to load content: ${err.message}`);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => { doLoad(); }, [doLoad]);

	useEffect(() => {
		if (!draft || !baseSha) return;
		tryStore({ baseSha, draft, staged: [...staged], ts: Date.now() });
	}, [draft, staged, baseSha]);

	const updateSection = useCallback((key, val) => {
		setDraft((prev) => (prev ? { ...prev, [key]: val } : prev));
	}, []);

	const stageSection = useCallback((key) => {
		setStaged((prev) => new Set([...prev, key]));
	}, []);

	const unstageSection = useCallback((key) => {
		setStaged((prev) => {
			const s = new Set(prev);
			s.delete(key);
			return s;
		});
	}, []);

	const discardSection = useCallback(
		(key) => {
			if (!base) return;
			setDraft((prev) => (prev ? { ...prev, [key]: base[key] } : prev));
			unstageSection(key);
		},
		[base, unstageSection]
	);

	const keepDraft = useCallback(() => setConflict(false), []);

	const discardAndReload = useCallback(() => {
		setConflict(false);
		try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
		doLoad();
	}, [doLoad]);

	const restoreDraft = useCallback((restoredContent) => {
		const allKeys = Object.keys(restoredContent);
		setDraft(restoredContent);
		setStaged(new Set(allKeys));
		setConflict(false);
	}, []);

	const isSectionDirty = useCallback(
		(key) => {
			if (!base || !draft) return false;
			return JSON.stringify(base[key]) !== JSON.stringify(draft[key]);
		},
		[base, draft]
	);

	return {
		base,
		baseSha,
		draft,
		staged,
		stagedCount: staged.size,
		loading,
		loadError,
		conflict,
		updateSection,
		stageSection,
		unstageSection,
		discardSection,
		keepDraft,
		discardAndReload,
		restoreDraft,
		reload: doLoad,
		isSectionDirty,
	};
}

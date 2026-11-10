import { useState, useMemo } from "react";
import fallback from "../content/fallback.json";
import { validateContent } from "../content/schema";
import { DRAFT_LS_KEY } from "../lib/draftStorageKey";
import { usePreviewMode } from "../lib/usePreviewMode";
import { useStagedCvUrl } from "../lib/useStagedCvUrl";

function tryDraft() {
	try {
		const raw = localStorage.getItem(DRAFT_LS_KEY);
		if (!raw) return null;
		const stored = JSON.parse(raw);
		const draft = stored?.draft;
		if (!draft) return null;
		return validateContent(draft).ok ? draft : null;
	} catch {
		return null;
	}
}

export function usePortfolioData() {
	const { isPreview } = usePreviewMode();

	const [draftData] = useState(() => (isPreview ? tryDraft() : null));
	const previewInvalid = isPreview && !draftData;
	const baseData = draftData ?? fallback;

	const stagedCvUrl = useStagedCvUrl(isPreview);

	const data = useMemo(() => {
		if (!stagedCvUrl) return baseData;
		return {
			...baseData,
			profile: {
				...baseData.profile,
				links: { ...baseData.profile?.links, cv: stagedCvUrl },
			},
			availability: {
				...baseData.availability,
				href: stagedCvUrl,
			},
		};
	}, [baseData, stagedCvUrl]);

	return { data, isPreview, previewInvalid };
}

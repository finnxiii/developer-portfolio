import { DraftCtx } from "./draft/DraftCtx";
import { useDraft } from "./draft/useDraft";

export function DraftProvider({ children }) {
	const draft = useDraft();
	return <DraftCtx.Provider value={draft}>{children}</DraftCtx.Provider>;
}

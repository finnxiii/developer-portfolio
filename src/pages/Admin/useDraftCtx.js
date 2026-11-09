import { useContext } from "react";
import { DraftCtx } from "./draft/DraftCtx";

export function useDraftCtx() {
	const ctx = useContext(DraftCtx);
	if (!ctx) throw new Error("useDraftCtx must be used within DraftProvider");
	return ctx;
}

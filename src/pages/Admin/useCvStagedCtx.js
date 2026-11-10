import { useContext } from "react";
import { CvCtx } from "./cv/CvCtx";

export function useCvStagedCtx() {
	const ctx = useContext(CvCtx);
	if (!ctx) throw new Error("useCvStagedCtx must be used within CvStagedProvider");
	return ctx;
}

import { CvCtx } from "./cv/CvCtx";
import { useCvStaged } from "./cv/useCvStaged";

export function CvStagedProvider({ children }) {
	const cv = useCvStaged();
	return <CvCtx.Provider value={cv}>{children}</CvCtx.Provider>;
}

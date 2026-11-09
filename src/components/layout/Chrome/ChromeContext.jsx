import { createContext, useCallback, useContext, useState } from "react";

const ChromeCtx = createContext(null);

export function ChromeProvider({ children }) {
	const [extraTab, setExtraTab] = useState(null);

	const registerTab = useCallback((tab) => setExtraTab(tab), []);
	const unregisterTab = useCallback(() => setExtraTab(null), []);

	return (
		<ChromeCtx.Provider value={{ extraTab, registerTab, unregisterTab }}>
			{children}
		</ChromeCtx.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useChrome() {
	const ctx = useContext(ChromeCtx);
	if (!ctx) throw new Error("useChrome must be used inside ChromeProvider");
	return ctx;
}

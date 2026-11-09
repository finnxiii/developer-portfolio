import { createContext, useCallback, useContext, useState } from "react";

const FrontPageCtx = createContext(null);

export function FrontPageProvider({ children }) {
	const [solved, setSolved] = useState(() => {
		try { return sessionStorage.getItem("bug-solved") === "1"; } catch { return false; }
	});

	const solve = useCallback(() => {
		setSolved(true);
		try { sessionStorage.setItem("bug-solved", "1"); } catch { /* unavailable */ }
	}, []);

	const resetBug = useCallback(() => {
		setSolved(false);
		try { sessionStorage.removeItem("bug-solved"); } catch { /* unavailable */ }
	}, []);

	return (
		<FrontPageCtx.Provider value={{ solved, solve, resetBug }}>
			{children}
		</FrontPageCtx.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFrontPage() {
	const ctx = useContext(FrontPageCtx);
	if (!ctx) throw new Error("useFrontPage must be inside FrontPageProvider");
	return ctx;
}

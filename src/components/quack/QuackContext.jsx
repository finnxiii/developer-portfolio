import { createContext, useCallback, useContext, useState } from "react";

const QuackCtx = createContext(null);

export function QuackProvider({ children }) {
	const [quips, setQuipsState] = useState([]);
	const [pending, setPending] = useState(null);
	const [chatWanted, setChatWanted] = useState(false);

	const say = useCallback((text) => setPending(text), []);
	const setQuips = useCallback((list) => setQuipsState(list), []);
	const openChat = useCallback(() => setChatWanted(true), []);
	const clearPending = useCallback(() => setPending(null), []);
	const clearChatWanted = useCallback(() => setChatWanted(false), []);

	return (
		<QuackCtx.Provider
			value={{
				quips,
				pending,
				chatWanted,
				say,
				setQuips,
				openChat,
				clearPending,
				clearChatWanted,
			}}
		>
			{children}
		</QuackCtx.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useQuack() {
	const ctx = useContext(QuackCtx);
	if (!ctx) throw new Error("useQuack must be used inside QuackProvider");
	return ctx;
}

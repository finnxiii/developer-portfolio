import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";

const StageContext = createContext(null);

export function StageProvider({ children }) {
	const [scenes, setScenes] = useState([]);
	const [activeId, setActiveId] = useState(null);
	const [direction, setDirection] = useState("forward");
	const [stageNode, setStageNode] = useState(null);

	// Refs so activateScene can read current state without stale closures
	const scenesRef = useRef([]);
	const activeIdRef = useRef(null);

	useEffect(() => { scenesRef.current = scenes; }, [scenes]);
	useEffect(() => { activeIdRef.current = activeId; }, [activeId]);

	const registerScene = useCallback((scene) => {
		setScenes((prev) => {
			if (prev.some((s) => s.id === scene.id)) {
				return prev.map((s) => (s.id === scene.id ? { ...s, ...scene } : s));
			}
			return [...prev, scene];
		});
		// Auto-activate: first scene if no active, or the hash-matching scene
		setActiveId((current) => {
			if (current !== null) return current;
			const hash = window.location.hash.slice(1);
			// If there's a hash, hold off until that scene registers
			if (hash && hash !== scene.id) return current;
			return scene.id;
		});
	}, []);

	const unregisterScene = useCallback((id) => {
		setScenes((prev) => prev.filter((s) => s.id !== id));
		// Clear active so the next registered scene can auto-activate (handles route changes)
		setActiveId((current) => (current === id ? null : current));
	}, []);

	const activateScene = useCallback((id) => {
		const currentScenes = scenesRef.current;
		const currentActiveId = activeIdRef.current;
		if (currentActiveId === id) return;

		const prevIdx = currentScenes.findIndex((s) => s.id === currentActiveId);
		const nextIdx = currentScenes.findIndex((s) => s.id === id);
		if (prevIdx !== -1 && nextIdx !== -1) {
			setDirection(nextIdx > prevIdx ? "forward" : "back");
		}
		setActiveId(id);
	}, []);

	const value = {
		scenes,
		activeId,
		direction,
		stageNode,
		setStageNode,
		registerScene,
		unregisterScene,
		activateScene,
	};

	return (
		<StageContext.Provider value={value}>
			{children}
		</StageContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStage() {
	const ctx = useContext(StageContext);
	if (!ctx) throw new Error("useStage must be used inside StageProvider");
	return ctx;
}

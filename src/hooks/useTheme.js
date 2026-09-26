import { useState, useEffect } from "react";

function getInitialTheme() {
	try {
		const stored = localStorage.getItem("theme");
		if (stored === "dark" || stored === "light") return stored;
	} catch { /* storage unavailable */ }
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
	const [theme, setTheme] = useState(getInitialTheme);

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		try { localStorage.setItem("theme", theme); } catch { /* storage unavailable */ }
	}, [theme]);

	const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));

	return { theme, toggle };
}

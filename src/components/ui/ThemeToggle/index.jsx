import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import "./ThemeToggle.scss";

export default function ThemeToggle() {
	const { theme, toggle } = useTheme();
	const isDark = theme === "dark";

	return (
		<button
			className="theme-toggle"
			onClick={toggle}
			aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
			type="button"
		>
			{isDark ? <Sun size={18} strokeWidth={1.75} /> : <Moon size={18} strokeWidth={1.75} />}
		</button>
	);
}

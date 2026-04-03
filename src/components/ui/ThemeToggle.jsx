import { motion } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";
import { FiMoon, FiSun } from "react-icons/fi";
import "./ThemeToggle.css";

export default function ThemeToggle() {
	const { theme, toggle } = useTheme();
	const isDark = theme === "dark";

	return (
		<div className="theme-toggle-wrap" onClick={toggle} role="button" aria-label="Toggle theme">
			{/* sliding pill — behind everything */}
			<motion.div
				className="theme-toggle-pill"
				animate={{ x: isDark ? "100%" : "0%" }}
				transition={{ type: "spring", damping: 15, stiffness: 250 }}
			/>

			{/* moon icon */}
			<span className={`theme-toggle-icon ${!isDark ? "theme-toggle-icon--active" : ""}`}>
				<FiMoon />
			</span>

			{/* sun icon */}
			<span className={`theme-toggle-icon ${isDark ? "theme-toggle-icon--active" : ""}`}>
				<FiSun />
			</span>
		</div>
	);
}

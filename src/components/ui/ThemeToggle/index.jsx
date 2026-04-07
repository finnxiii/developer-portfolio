import { motion } from "motion/react";
import { useTheme } from "../../../hooks/useTheme";
import { FiMoon, FiSun } from "react-icons/fi";
import "./ThemeToggle.scss";

const MotionDiv = motion.div;

export default function ThemeToggle() {
	const { theme, toggle } = useTheme();
	const isDark = theme === "dark";

	return (
		<div className="theme-toggle-wrap" onClick={toggle} role="button" aria-label="Toggle theme">
			{/* sliding pill — behind everything */}
			<MotionDiv
				className="theme-toggle-pill"
				animate={{ x: isDark ? "100%" : "0%" }}
				transition={{ type: "spring", damping: 15, stiffness: 250 }}
			/>

			{/* Light Mode */}
			<span className={`theme-toggle-icon ${!isDark ? "theme-toggle-icon--active" : ""}`}>
				<FiSun />
			</span>

			{/* Dark Mode */}
			<span className={`theme-toggle-icon ${isDark ? "theme-toggle-icon--active" : ""}`}>
				<FiMoon />
			</span>
		</div>
	);
}

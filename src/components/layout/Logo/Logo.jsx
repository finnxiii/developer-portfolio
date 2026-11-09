import { Link } from "react-router-dom";
import { useStage } from "../../stage/StageContext";
import "./Logo.scss";

export default function Logo() {
	const { scenes, activeId } = useStage();
	const activeScene = scenes.find((s) => s.id === activeId);
	const isDark = activeScene?.dark ?? false;

	return (
		<Link
			to="/"
			className="logo"
			aria-label="finnxiii, home"
			style={{ color: isDark ? "var(--dark-text)" : "var(--ink)" }}
		>
			f.
		</Link>
	);
}

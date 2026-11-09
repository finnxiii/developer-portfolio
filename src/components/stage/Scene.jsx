import { useStage } from "./StageContext";
import "./stage.scss";

export default function Scene({ id, children }) {
	const { activeId, direction } = useStage();
	const isActive = activeId === id;
	const inactiveScale = direction === "forward" ? "scale(1.06)" : "scale(0.96)";

	return (
		<div
			className="scene"
			data-scene-id={id}
			style={{
				opacity: isActive ? 1 : 0,
				transform: isActive ? "none" : inactiveScale,
				filter: isActive ? "none" : "blur(10px)",
				pointerEvents: isActive ? "auto" : "none",
			}}
		>
			{children}
		</div>
	);
}

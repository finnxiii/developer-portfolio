import { useCallback } from "react";
import { useStage } from "./StageContext";
import "./stage.scss";

export default function Stage() {
	const { scenes, activeId, setStageNode } = useStage();

	const activeScene = scenes.find((s) => s.id === activeId);
	const bg = activeScene?.bg ?? "var(--paper)";

	const mountRef = useCallback((node) => {
		setStageNode(node);
	}, [setStageNode]);

	return (
		<div
			className="stage"
			aria-hidden="true"
			style={{ backgroundColor: bg }}
		>
			<div ref={mountRef} />
		</div>
	);
}

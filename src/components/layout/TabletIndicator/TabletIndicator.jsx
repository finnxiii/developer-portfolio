import { useStage } from "../../stage/StageContext";
import "./TabletIndicator.scss";

export default function TabletIndicator() {
	const { scenes, activeId } = useStage();
	const active = scenes.find((s) => s.id === activeId);

	if (!active) return null;

	return (
		<div className="tablet-indicator" aria-hidden="true">
			<span className="tablet-indicator__ln">{active.ln}</span>
			{" "}
			<span className="tablet-indicator__fn">{active.fn}</span>
		</div>
	);
}

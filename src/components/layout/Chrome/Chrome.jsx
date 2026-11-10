import { useStage } from "../../stage/StageContext";
import Logo from "../Logo/Logo";
import TabletIndicator from "../TabletIndicator/TabletIndicator";
import "./Chrome.scss";

export default function Chrome() {
	const { scenes, activeId } = useStage();
	const activeScene = scenes.find((s) => s.id === activeId);
	const isDark = activeScene?.dark ?? false;

	return (
		<div className="chrome" data-dark={isDark ? "true" : undefined}>
			<Logo />
			<TabletIndicator />
		</div>
	);
}

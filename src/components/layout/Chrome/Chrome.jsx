import { useStage } from "../../stage/StageContext";
import { useChrome } from "./ChromeContext";
import Logo from "../Logo/Logo";
import TabNav from "../TabNav/TabNav";
import "./Chrome.scss";

export default function Chrome() {
	const { scenes, activeId } = useStage();
	const { extraTab } = useChrome();
	const activeScene = scenes.find((s) => s.id === activeId);
	const isDark = activeScene?.dark ?? false;

	return (
		<div className="chrome" data-dark={isDark ? "true" : undefined}>
			<Logo />
			<TabNav extraTab={extraTab} />
		</div>
	);
}

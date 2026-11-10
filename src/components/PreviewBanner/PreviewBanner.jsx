import { useEffect, useRef } from "react";
import { useStage } from "../stage/StageContext";
import { useQuack } from "../quack/QuackContext";
import { usePreviewMode } from "../../lib/usePreviewMode";
import "./PreviewBanner.scss";

export default function PreviewBanner() {
	const { isPreview, exitPreview } = usePreviewMode();
	const { scenes, activeId } = useStage();
	const { say } = useQuack();
	const saidRef = useRef(false);

	const activeScene = scenes.find((s) => s.id === activeId);
	const isDark = activeScene?.dark ?? false;

	useEffect(() => {
		if (!isPreview) return;
		const meta = document.createElement("meta");
		meta.name = "robots";
		meta.content = "noindex";
		document.head.appendChild(meta);
		return () => { if (document.head.contains(meta)) document.head.removeChild(meta); };
	}, [isPreview]);

	useEffect(() => {
		if (isPreview && !saidRef.current) {
			saidRef.current = true;
			say("Shh. This is a preview.");
		}
	}, [isPreview, say]);

	if (!isPreview) return null;

	return (
		<div
			className="preview-banner"
			role="status"
			aria-label="Draft preview active"
			data-dark={isDark || undefined}
		>
			<span className="preview-banner__dot" aria-hidden="true" />
			<span className="preview-banner__label">Previewing your draft · not live</span>
			<span className="preview-banner__sep" aria-hidden="true">·</span>
			<button
				type="button"
				className="preview-banner__exit"
				onClick={exitPreview}
			>
				Exit preview
			</button>
		</div>
	);
}

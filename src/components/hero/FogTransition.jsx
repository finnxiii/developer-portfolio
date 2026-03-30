import { motion as Motion, useTransform } from "framer-motion";

function FogTransition({ progress }) {
	const baseOpacity = useTransform(progress, [0, 0.2, 0.5, 0.82, 1], [0, 0.02, 0.1, 0.38, 1]);

	const midOpacity = useTransform(progress, [0, 0.28, 0.6, 0.86, 1], [0, 0.04, 0.18, 0.56, 1]);

	const nearOpacity = useTransform(progress, [0, 0.35, 0.68, 0.9, 1], [0, 0.06, 0.24, 0.7, 1]);

	return (
		<div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
			<Motion.div style={{ opacity: baseOpacity }} className="absolute inset-0 bg-[var(--about-bg)]" />

			<Motion.div style={{ opacity: midOpacity }} className="fog-layer fog-layer-back absolute inset-[-10%]" />

			<Motion.div style={{ opacity: nearOpacity }} className="fog-layer fog-layer-front absolute inset-[-12%]" />

			<Motion.div
				style={{ opacity: nearOpacity }}
				className="absolute inset-x-0 bottom-0 h-[60%] bg-[linear-gradient(to_top,var(--about-bg)_0%,rgba(166,173,179,0.72)_36%,transparent_100%)]"
			/>
		</div>
	);
}

export default FogTransition;

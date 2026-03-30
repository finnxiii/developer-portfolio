import { motion as Motion, useTransform } from "framer-motion";

function Transition({ fogOpacity, lowerFogOpacity, progress }) {
	const transitionTextOpacity = useTransform(progress, [0.12, 0.34, 0.62], [0, 0.55, 0]);

	const transitionTextY = useTransform(progress, [0.12, 0.62], [24, -10]);

	return (
		<section id="transition" className="relative min-h-[150vh] bg-transparent" aria-hidden="true">
			<div className="sticky top-0 h-screen overflow-hidden">
				<div className="pointer-events-none absolute inset-0 z-20">
					<Motion.div style={{ opacity: fogOpacity }} className="absolute inset-0 bg-[var(--about-bg)]" />

					<Motion.div style={{ opacity: lowerFogOpacity }} className="fog-layer fog-layer-back absolute inset-[-10%]" />

					<Motion.div
						style={{ opacity: lowerFogOpacity }}
						className="fog-layer fog-layer-front absolute inset-[-12%]"
					/>

					<Motion.div
						style={{ opacity: lowerFogOpacity }}
						className="absolute inset-x-0 bottom-0 h-[60%] bg-[linear-gradient(to_top,var(--about-bg)_0%,rgba(166,173,179,0.82)_38%,transparent_100%)]"
					/>
				</div>

				<div className="relative z-30 flex h-screen items-center justify-center px-6">
					<Motion.div
						style={{ opacity: transitionTextOpacity, y: transitionTextY }}
						className="max-w-2xl text-center text-[var(--about-text)]"
					>
						<p className="mb-4 text-xs font-medium uppercase tracking-[0.24em] text-[var(--about-text-muted)]">
							Transition
						</p>
						<h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
							Moving from atmosphere into clarity.
						</h2>
					</Motion.div>
				</div>
			</div>
		</section>
	);
}

export default Transition;

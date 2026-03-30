import { motion as Motion, useInView } from "framer-motion";
import { useRef } from "react";

function RevealTextBlock({ children, className = "", delay = 0 }) {
	const ref = useRef(null);
	const isInView = useInView(ref, {
		once: true,
		margin: "-15% 0px -10% 0px",
	});

	return (
		<Motion.div
			ref={ref}
			initial={{ opacity: 0, y: 28 }}
			animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
			transition={{
				duration: 0.8,
				delay,
				ease: [0.22, 1, 0.36, 1],
			}}
			className={className}
		>
			{children}
		</Motion.div>
	);
}

export default RevealTextBlock;

import Moon from "./Moon";
import Stars from "./Stars";
import CloudLayer from "./CloudLayer";

function HeroBackground() {
	return (
		<div className="absolute inset-0">
			<div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--bg-1)_0%,var(--bg-2)_38%,var(--bg-3)_100%)]" />
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_46%,rgba(0,0,0,0.18)_74%,rgba(0,0,0,0.34)_100%)]" />
			<Stars />
			<Moon />
			<CloudLayer />
		</div>
	);
}

export default HeroBackground;

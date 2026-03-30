import { motion as Motion } from "framer-motion";
import HeroBackground from "../components/hero/HeroBackground";

function HeroContent() {
	return (
		<div className="relative z-10 mx-auto flex h-full max-w-6xl items-center justify-center px-5 py-20 sm:px-6 sm:py-24">
			<div className="max-w-3xl text-center">
				<p className="mb-4 text-[0.58rem] uppercase tracking-[0.18em] text-[var(--text-muted)] sm:mb-5 sm:text-[0.68rem] sm:tracking-[0.24em] md:text-[0.72rem] md:tracking-[0.28em]">
					Software Engineer in the making
				</p>

				<h1 className="text-[3rem] font-semibold leading-[1.06] tracking-[0.01em] sm:text-[3.6rem] md:text-[4.1rem] lg:text-[4.6rem]">
					<span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Hello, World.</span>
					<span className="mt-3 block text-white/85 sm:mt-4">I&apos;m Finn.</span>
				</h1>

				<p className="mx-auto mt-5 max-w-[19rem] text-[0.98rem] leading-8 text-[var(--text-soft)] sm:mt-6 sm:max-w-[30rem] sm:text-[1.04rem] md:max-w-[34rem] md:text-[1.08rem]">
					I build modern web apps, developer tools, and purposeful software experiences.
				</p>
			</div>
		</div>
	);
}

const Hero = ({ heroOpacity }) => {
	return (
		<Motion.section
			id="home"
			style={{ opacity: heroOpacity }}
			className="fixed inset-0 z-0 overflow-hidden bg-[var(--bg-2)] text-white"
		>
			<HeroBackground />
			<HeroContent />
		</Motion.section>
	);
};

export default Hero;

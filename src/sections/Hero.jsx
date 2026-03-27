const Hero = () => {
	return (
		<section
			id="home"
			className="relative min-h-screen overflow-hidden border-b border-white/10 bg-[#0f1115] text-white"
		>
			<div className="absolute inset-0">
				{/* Sky gradient */}
				<div className="absolute inset-0 bg-[linear-gradient(to_bottom,_#0b0d11_0%,_#0f1115_40%,_#12151a_100%)]" />

				{/* Stars */}
				<div className="absolute inset-0">
					<span
						className="absolute left-[8%] top-[16%] h-[3px] w-[3px] animate-twinkle bg-white/80"
						style={{ animationDelay: "0s", boxShadow: "0 0 6px rgba(255,255,255,0.25)" }}
					/>
					<span className="absolute left-[15%] top-[28%] h-[2px] w-[2px] bg-white/60" />
					<span className="absolute left-[24%] top-[12%] h-[1.5px] w-[1.5px] bg-white/60" />
					<span
						className="absolute left-[32%] top-[24%] h-[3px] w-[3px] animate-twinkle bg-white/75"
						style={{ animationDelay: "0.8s", boxShadow: "0 0 6px rgba(255,255,255,0.25)" }}
					/>
					<span className="absolute left-[42%] top-[14%] h-[2px] w-[2px] bg-white/60" />
					<span
						className="absolute left-[56%] top-[10%] h-[3px] w-[3px] animate-twinkle bg-white/90"
						style={{ animationDelay: "1.6s", boxShadow: "0 0 6px rgba(255,255,255,0.25)" }}
					/>
					<span className="absolute left-[63%] top-[22%] h-[2px] w-[2px] bg-white/60" />
					<span className="absolute left-[72%] top-[14%] h-[1.5px] w-[1.5px] bg-white/50" />
					<span
						className="absolute left-[82%] top-[24%] h-[3px] w-[3px] animate-twinkle bg-white/80"
						style={{ animationDelay: "2.2s", boxShadow: "0 0 6px rgba(255,255,255,0.25)" }}
					/>
					<span className="absolute left-[90%] top-[17%] h-[2px] w-[2px] bg-white/60" />
					<span className="absolute left-[20%] top-[42%] h-[1.5px] w-[1.5px] bg-white/50" />
					<span className="absolute left-[78%] top-[40%] h-[1.5px] w-[1.5px] bg-white/50" />
				</div>

				{/* Moon glow */}
				<div className="absolute right-16 top-20 h-40 w-40 animate-moon-pulse rounded-full bg-white/15 blur-3xl sm:h-52 sm:w-52" />

				{/* Moon */}
				<div className="absolute right-20 top-24 h-20 w-20 rounded-full bg-[#f5f7fa] shadow-[0_0_60px_rgba(255,255,255,0.15)] sm:h-24 sm:w-24" />

				{/* Clouds */}
				<div className="absolute inset-0">
					{/* Left upper cloud */}
					<div className="absolute left-[4%] top-[28%] animate-drift-right">
						<div className="relative h-16 w-36">
							<span className="absolute left-4 top-0 h-6 w-10 bg-[#2f3945]/45" />
							<span className="absolute left-12 top-0 h-6 w-10 bg-[#2f3945]/45" />
							<span className="absolute left-20 top-2 h-6 w-10 bg-[#2f3945]/45" />
							<span className="absolute left-0 top-6 h-6 w-12 bg-[#2a333d]/40" />
							<span className="absolute left-10 top-6 h-6 w-12 bg-[#2a333d]/40" />
							<span className="absolute left-20 top-6 h-6 w-12 bg-[#2a333d]/40" />
							<span className="absolute left-8 top-10 h-5 w-16 bg-[#242c35]/35" />
						</div>
					</div>

					{/* Right upper cloud near moon */}
					<div className="absolute right-[5%] top-[24%] animate-drift-left">
						<div className="relative h-20 w-44">
							<span className="absolute left-8 top-0 h-7 w-12 bg-[#3a4654]/50" />
							<span className="absolute left-20 top-0 h-7 w-12 bg-[#3a4654]/50" />
							<span className="absolute left-0 top-6 h-7 w-14 bg-[#2f3945]/45" />
							<span className="absolute left-12 top-6 h-7 w-14 bg-[#2f3945]/45" />
							<span className="absolute left-24 top-6 h-7 w-14 bg-[#2f3945]/45" />
							<span className="absolute left-10 top-12 h-6 w-20 bg-[#2a333d]/35" />
						</div>
					</div>

					{/* Left lower soft cloud */}
					<div className="absolute left-[14%] top-[60%] animate-drift-right">
						<div className="relative h-12 w-28">
							<span className="absolute left-4 top-0 h-5 w-8 bg-[#2a333d]/25" />
							<span className="absolute left-12 top-0 h-5 w-8 bg-[#2a333d]/25" />
							<span className="absolute left-0 top-4 h-5 w-10 bg-[#2a3b4d]/20" />
							<span className="absolute left-10 top-4 h-5 w-10 bg-[#2a3b4d]/20" />
							<span className="absolute left-[72px] top-4 h-5 w-10 bg-[#2a3b4d]/20" />
						</div>
					</div>

					{/* Right lower soft cloud */}
					<div className="absolute right-[14%] top-[56%] animate-drift-left">
						<div className="relative h-14 w-32">
							<span className="absolute left-6 top-0 h-5 w-9 bg-[#2a333d]/25" />
							<span className="absolute left-14 top-0 h-5 w-9 bg-[#2a333d]/25" />
							<span className="absolute left-0 top-4 h-5 w-11 bg-[#2a3b4d]/20" />
							<span className="absolute left-10 top-4 h-5 w-11 bg-[#2a3b4d]/20" />
							<span className="absolute left-20 top-4 h-5 w-11 bg-[#2a3b4d]/20" />
						</div>
					</div>
				</div>
			</div>

			<div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-24">
				<div className="max-w-3xl animate-fade-up text-center">
					<p className="mb-5 text-[0.72rem] font-medium uppercase tracking-[0.28em] text-white/45 sm:text-xs">
						Software Engineer in the making
					</p>

					<h1 className="text-4xl font-semibold leading-[0.95] tracking-[0.02em] sm:text-5xl lg:text-6xl">
						<span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
							Hello, World<span className="text-white/40">.</span>
						</span>
						<span className="mt-3 block text-white/85">I&apos;m Finn.</span>
					</h1>

					<p className="mx-auto mt-7 max-w-[42rem] text-[1rem] leading-8 text-white/58 sm:text-[1.05rem]">
						I build modern web apps, developer tools, and purposeful software experiences.
					</p>

					<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
						<a
							href="#projects"
							className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white px-6 py-3 text-sm font-semibold text-black transition duration-300 hover:-translate-y-1 hover:bg-white/90"
						>
							View Projects
						</a>

						<a
							href="#contact"
							className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/10"
						>
							Contact Me
						</a>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;

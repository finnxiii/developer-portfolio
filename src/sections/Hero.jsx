const Hero = () => {
	return (
		<section
			id="home"
			className="relative min-h-screen overflow-hidden border-b border-white/10 bg-[#0f1115] text-white"
		>
			{/* Background */}
			<div className="absolute inset-0">
				{/* Base sky */}
				<div className="absolute inset-0 bg-[linear-gradient(to_bottom,_#090b0e_0%,_#0d1014_38%,_#12161b_100%)]" />

				{/* Vignette / edge darkening */}
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_42%,rgba(0,0,0,0.22)_72%,rgba(0,0,0,0.42)_100%)]" />

				{/* Moon lighting */}
				<div className="absolute right-[6%] top-[8%] h-56 w-56 rounded-full bg-white/[0.05] blur-[90px] sm:h-64 sm:w-64" />
				<div className="absolute right-[9%] top-[11%] h-32 w-32 animate-moon-pulse rounded-full bg-white/[0.06] blur-[40px] sm:h-36 sm:w-36" />

				{/* Stars */}
				<div className="absolute inset-0">
					<span
						className="absolute left-[8%] top-[16%] h-[3px] w-[3px] animate-twinkle bg-white/80"
						style={{ animationDelay: "0s", boxShadow: "0 0 6px rgba(255,255,255,0.22)" }}
					/>
					<span className="absolute left-[12%] top-[24%] h-[1.5px] w-[1.5px] bg-white/45" />
					<span className="absolute left-[15%] top-[28%] h-[2px] w-[2px] bg-white/55" />
					<span className="absolute left-[19%] top-[18%] h-[1.5px] w-[1.5px] bg-white/40" />
					<span className="absolute left-[24%] top-[12%] h-[1.5px] w-[1.5px] bg-white/55" />
					<span
						className="absolute left-[32%] top-[24%] h-[3px] w-[3px] animate-twinkle bg-white/75"
						style={{ animationDelay: "0.8s", boxShadow: "0 0 6px rgba(255,255,255,0.22)" }}
					/>
					<span className="absolute left-[36%] top-[14%] h-[2px] w-[2px] bg-white/50" />
					<span className="absolute left-[42%] top-[14%] h-[2px] w-[2px] bg-white/55" />
					<span className="absolute left-[48%] top-[20%] h-[1.5px] w-[1.5px] bg-white/38" />
					<span
						className="absolute left-[56%] top-[10%] h-[3px] w-[3px] animate-twinkle bg-white/88"
						style={{ animationDelay: "1.6s", boxShadow: "0 0 6px rgba(255,255,255,0.22)" }}
					/>
					<span className="absolute left-[60%] top-[18%] h-[1.5px] w-[1.5px] bg-white/42" />
					<span className="absolute left-[63%] top-[22%] h-[2px] w-[2px] bg-white/55" />
					<span className="absolute left-[68%] top-[12%] h-[1.5px] w-[1.5px] bg-white/38" />
					<span className="absolute left-[72%] top-[14%] h-[1.5px] w-[1.5px] bg-white/45" />
					<span
						className="absolute left-[82%] top-[24%] h-[3px] w-[3px] animate-twinkle bg-white/78"
						style={{ animationDelay: "2.2s", boxShadow: "0 0 6px rgba(255,255,255,0.22)" }}
					/>
					<span className="absolute left-[86%] top-[14%] h-[1.5px] w-[1.5px] bg-white/42" />
					<span className="absolute left-[90%] top-[17%] h-[2px] w-[2px] bg-white/55" />

					{/* mid / lower faint stars */}
					<span className="absolute left-[20%] top-[42%] h-[1.5px] w-[1.5px] bg-white/30" />
					<span className="absolute left-[28%] top-[48%] h-[1px] w-[1px] bg-white/22" />
					<span className="absolute left-[40%] top-[44%] h-[1px] w-[1px] bg-white/20" />
					<span className="absolute left-[52%] top-[50%] h-[1px] w-[1px] bg-white/18" />
					<span className="absolute left-[66%] top-[46%] h-[1px] w-[1px] bg-white/20" />
					<span className="absolute left-[78%] top-[40%] h-[1.5px] w-[1.5px] bg-white/28" />
					<span className="absolute left-[84%] top-[52%] h-[1px] w-[1px] bg-white/18" />
				</div>

				{/* Moon Image */}
				<div className="absolute right-[8%] top-[10%] w-32 sm:w-36 md:w-40">
					<img
						src="/assets/moon.png"
						alt="moon"
						className="w-full object-contain opacity-95 animate-[floatMoon_6s_ease-in-out_infinite] drop-shadow-[0_0_22px_rgba(255,255,255,0.12)]"
					/>
				</div>

				{/* Atmospheric haze */}
				<div className="absolute inset-x-0 bottom-[18%] h-24 bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.015)_100%)] blur-2xl" />

				{/* Clouds */}
				<div className="absolute inset-0">
					{/* Mobile clouds */}
					<div className="absolute inset-0 md:hidden">
						{/* upper left */}
						<div className="absolute left-[4%] top-[22%] animate-drift-right">
							<div className="relative h-10 w-24">
								<span className="absolute left-[12px] top-0 h-4 w-6 bg-[#2a3138]/30" />
								<span className="absolute left-[32px] top-0 h-4 w-6 bg-[#2a3138]/30" />
								<span className="absolute left-0 top-[14px] h-4 w-7 bg-[#232a31]/26" />
								<span className="absolute left-[20px] top-[14px] h-4 w-7 bg-[#232a31]/26" />
								<span className="absolute left-[40px] top-[14px] h-4 w-7 bg-[#232a31]/26" />
								<span className="absolute left-[60px] top-[14px] h-4 w-7 bg-[#232a31]/26" />
							</div>
						</div>

						{/* upper right near moon */}
						<div className="absolute right-[2%] top-[28%] animate-drift-left">
							<div className="relative h-10 w-24">
								<span className="absolute left-[12px] top-0 h-4 w-6 bg-[#2a3138]/24" />
								<span className="absolute left-[32px] top-0 h-4 w-6 bg-[#2a3138]/24" />
								<span className="absolute left-0 top-[14px] h-4 w-7 bg-[#232a31]/22" />
								<span className="absolute left-[20px] top-[14px] h-4 w-7 bg-[#232a31]/22" />
								<span className="absolute left-[40px] top-[14px] h-4 w-7 bg-[#232a31]/22" />
								<span className="absolute left-[60px] top-[14px] h-4 w-7 bg-[#232a31]/22" />
							</div>
						</div>

						{/* under text left */}
						<div className="absolute left-[6%] top-[62%] animate-drift-left">
							<div className="relative h-10 w-28">
								<span className="absolute left-[12px] top-0 h-4 w-6 bg-[#323b45]/24" />
								<span className="absolute left-[32px] top-0 h-4 w-6 bg-[#323b45]/24" />
								<span className="absolute left-[52px] top-0 h-4 w-6 bg-[#323b45]/24" />
								<span className="absolute left-0 top-[14px] h-4 w-7 bg-[#2b333c]/22" />
								<span className="absolute left-[20px] top-[14px] h-4 w-7 bg-[#2b333c]/22" />
								<span className="absolute left-[40px] top-[14px] h-4 w-7 bg-[#2b333c]/22" />
								<span className="absolute left-[60px] top-[14px] h-4 w-7 bg-[#2b333c]/22" />
							</div>
						</div>

						{/* under text right */}
						<div className="absolute right-[6%] top-[66%] animate-drift-right">
							<div className="relative h-10 w-28">
								<span className="absolute left-[12px] top-0 h-4 w-6 bg-[#323b45]/24" />
								<span className="absolute left-[32px] top-0 h-4 w-6 bg-[#323b45]/24" />
								<span className="absolute left-[52px] top-0 h-4 w-6 bg-[#323b45]/24" />
								<span className="absolute left-0 top-[14px] h-4 w-7 bg-[#2b333c]/22" />
								<span className="absolute left-[20px] top-[14px] h-4 w-7 bg-[#2b333c]/22" />
								<span className="absolute left-[40px] top-[14px] h-4 w-7 bg-[#2b333c]/22" />
								<span className="absolute left-[60px] top-[14px] h-4 w-7 bg-[#2b333c]/22" />
							</div>
						</div>

						{/* bottom soft groups */}
						<div className="absolute bottom-[12%] left-[4%] animate-drift-right">
							<div className="relative h-12 w-32">
								<span className="absolute left-[16px] top-0 h-5 w-8 bg-[#3a444f]/24" />
								<span className="absolute left-[40px] top-0 h-5 w-8 bg-[#3a444f]/24" />
								<span className="absolute left-[64px] top-0 h-5 w-8 bg-[#3a444f]/24" />
								<span className="absolute left-0 top-[18px] h-5 w-10 bg-[#323b45]/22" />
								<span className="absolute left-[28px] top-[18px] h-5 w-10 bg-[#323b45]/22" />
								<span className="absolute left-[56px] top-[18px] h-5 w-10 bg-[#323b45]/22" />
								<span className="absolute left-[84px] top-[18px] h-5 w-10 bg-[#323b45]/22" />
							</div>
						</div>

						<div className="absolute bottom-[8%] right-[4%] animate-drift-left">
							<div className="relative h-12 w-32">
								<span className="absolute left-[16px] top-0 h-5 w-8 bg-[#3a444f]/24" />
								<span className="absolute left-[40px] top-0 h-5 w-8 bg-[#3a444f]/24" />
								<span className="absolute left-[64px] top-0 h-5 w-8 bg-[#3a444f]/24" />
								<span className="absolute left-0 top-[18px] h-5 w-10 bg-[#323b45]/22" />
								<span className="absolute left-[28px] top-[18px] h-5 w-10 bg-[#323b45]/22" />
								<span className="absolute left-[56px] top-[18px] h-5 w-10 bg-[#323b45]/22" />
								<span className="absolute left-[84px] top-[18px] h-5 w-10 bg-[#323b45]/22" />
							</div>
						</div>
					</div>

					{/* Desktop / tablet clouds */}
					<div className="absolute inset-0 hidden md:block">
						{/* upper left */}
						<div className="absolute left-[3%] top-[24%] animate-drift-right">
							<div className="relative h-16 w-40">
								<span className="absolute left-[24px] top-0 h-6 w-10 bg-[#2a3138]/34" />
								<span className="absolute left-[56px] top-0 h-6 w-10 bg-[#2a3138]/34" />
								<span className="absolute left-[88px] top-[4px] h-6 w-10 bg-[#2a3138]/34" />
								<span className="absolute left-0 top-[24px] h-6 w-12 bg-[#232a31]/30" />
								<span className="absolute left-[40px] top-[24px] h-6 w-12 bg-[#232a31]/30" />
								<span className="absolute left-[80px] top-[24px] h-6 w-12 bg-[#232a31]/30" />
								<span className="absolute left-[112px] top-[24px] h-6 w-12 bg-[#232a31]/30" />
								<span className="absolute left-[40px] top-[40px] h-5 w-20 bg-[#1c2229]/24" />
							</div>
						</div>

						{/* upper mid-left */}
						<div className="absolute left-[18%] top-[34%] animate-drift-left">
							<div className="relative h-14 w-32">
								<span className="absolute left-[16px] top-0 h-5 w-10 bg-[#2a3138]/26" />
								<span className="absolute left-[48px] top-0 h-5 w-10 bg-[#2a3138]/26" />
								<span className="absolute left-0 top-[20px] h-5 w-12 bg-[#232a31]/22" />
								<span className="absolute left-[40px] top-[20px] h-5 w-12 bg-[#232a31]/22" />
								<span className="absolute left-[80px] top-[20px] h-5 w-12 bg-[#232a31]/22" />
							</div>
						</div>

						{/* upper right near moon */}
						<div className="absolute right-[2%] top-[24%] animate-drift-left">
							<div className="relative h-20 w-44">
								<span className="absolute left-[32px] top-0 h-7 w-12 bg-[#313840]/28" />
								<span className="absolute left-[64px] top-0 h-7 w-12 bg-[#313840]/28" />
								<span className="absolute left-0 top-[24px] h-7 w-14 bg-[#2a3138]/24" />
								<span className="absolute left-[40px] top-[24px] h-7 w-14 bg-[#2a3138]/24" />
								<span className="absolute left-[80px] top-[24px] h-7 w-14 bg-[#2a3138]/24" />
								<span className="absolute left-[120px] top-[24px] h-7 w-14 bg-[#2a3138]/24" />
								<span className="absolute left-[48px] top-[48px] h-6 w-24 bg-[#1c2229]/18" />
							</div>
						</div>

						{/* under text left */}
						<div className="absolute left-[10%] top-[58%] animate-drift-left">
							<div className="relative h-12 w-36">
								<span className="absolute left-[16px] top-0 h-5 w-9 bg-[#232a31]/18" />
								<span className="absolute left-[48px] top-0 h-5 w-9 bg-[#232a31]/18" />
								<span className="absolute left-[80px] top-0 h-5 w-9 bg-[#232a31]/18" />
								<span className="absolute left-0 top-[18px] h-5 w-11 bg-[#1c2229]/15" />
								<span className="absolute left-[40px] top-[18px] h-5 w-11 bg-[#1c2229]/15" />
								<span className="absolute left-[80px] top-[18px] h-5 w-11 bg-[#1c2229]/15" />
								<span className="absolute left-[120px] top-[18px] h-5 w-11 bg-[#1c2229]/15" />
							</div>
						</div>

						{/* under text center */}
						<div className="absolute left-1/2 top-[63%] -translate-x-1/2 animate-drift-right">
							<div className="relative h-12 w-44">
								<span className="absolute left-[24px] top-0 h-5 w-10 bg-[#232a31]/14" />
								<span className="absolute left-[56px] top-0 h-5 w-10 bg-[#232a31]/14" />
								<span className="absolute left-[88px] top-0 h-5 w-10 bg-[#232a31]/14" />
								<span className="absolute left-[120px] top-0 h-5 w-10 bg-[#232a31]/14" />
								<span className="absolute left-0 top-[18px] h-5 w-12 bg-[#1c2229]/12" />
								<span className="absolute left-[40px] top-[18px] h-5 w-12 bg-[#1c2229]/12" />
								<span className="absolute left-[80px] top-[18px] h-5 w-12 bg-[#1c2229]/12" />
								<span className="absolute left-[120px] top-[18px] h-5 w-12 bg-[#1c2229]/12" />
							</div>
						</div>

						{/* under text right */}
						<div className="absolute right-[12%] top-[58%] animate-drift-right">
							<div className="relative h-12 w-36">
								<span className="absolute left-[16px] top-0 h-5 w-9 bg-[#232a31]/18" />
								<span className="absolute left-[48px] top-0 h-5 w-9 bg-[#232a31]/18" />
								<span className="absolute left-[80px] top-0 h-5 w-9 bg-[#232a31]/18" />
								<span className="absolute left-0 top-[18px] h-5 w-11 bg-[#1c2229]/15" />
								<span className="absolute left-[40px] top-[18px] h-5 w-11 bg-[#1c2229]/15" />
								<span className="absolute left-[80px] top-[18px] h-5 w-11 bg-[#1c2229]/15" />
								<span className="absolute left-[120px] top-[18px] h-5 w-11 bg-[#1c2229]/15" />
							</div>
						</div>

						{/* bottom left big */}
						<div className="absolute bottom-[10%] left-[2%] animate-drift-right">
							<div className="relative h-16 w-52">
								<span className="absolute left-[24px] top-0 h-6 w-12 bg-[#3a444f]/32" />
								<span className="absolute left-[64px] top-0 h-6 w-12 bg-[#3a444f]/32" />
								<span className="absolute left-[104px] top-0 h-6 w-12 bg-[#3a444f]/32" />
								<span className="absolute left-0 top-[22px] h-6 w-14 bg-[#323b45]/28" />
								<span className="absolute left-[44px] top-[22px] h-6 w-14 bg-[#323b45]/28" />
								<span className="absolute left-[88px] top-[22px] h-6 w-14 bg-[#323b45]/28" />
								<span className="absolute left-[132px] top-[22px] h-6 w-14 bg-[#323b45]/28" />
								<span className="absolute left-[176px] top-[22px] h-6 w-14 bg-[#323b45]/28" />
							</div>
						</div>

						{/* bottom center big */}
						<div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 animate-drift-left">
							<div className="relative h-16 w-64">
								<span className="absolute left-[32px] top-0 h-6 w-12 bg-[#3a444f]/30" />
								<span className="absolute left-[72px] top-0 h-6 w-12 bg-[#3a444f]/30" />
								<span className="absolute left-[112px] top-0 h-6 w-12 bg-[#3a444f]/30" />
								<span className="absolute left-[152px] top-0 h-6 w-12 bg-[#3a444f]/30" />
								<span className="absolute left-[192px] top-0 h-6 w-12 bg-[#3a444f]/30" />
								<span className="absolute left-0 top-[22px] h-6 w-14 bg-[#323b45]/26" />
								<span className="absolute left-[48px] top-[22px] h-6 w-14 bg-[#323b45]/26" />
								<span className="absolute left-[96px] top-[22px] h-6 w-14 bg-[#323b45]/26" />
								<span className="absolute left-[144px] top-[22px] h-6 w-14 bg-[#323b45]/26" />
								<span className="absolute left-[192px] top-[22px] h-6 w-14 bg-[#323b45]/26" />
							</div>
						</div>

						{/* bottom right big */}
						<div className="absolute bottom-[11%] right-[2%] animate-drift-right">
							<div className="relative h-16 w-52">
								<span className="absolute left-[24px] top-0 h-6 w-12 bg-[#3a444f]/32" />
								<span className="absolute left-[64px] top-0 h-6 w-12 bg-[#3a444f]/32" />
								<span className="absolute left-[104px] top-0 h-6 w-12 bg-[#3a444f]/32" />
								<span className="absolute left-0 top-[22px] h-6 w-14 bg-[#323b45]/28" />
								<span className="absolute left-[44px] top-[22px] h-6 w-14 bg-[#323b45]/28" />
								<span className="absolute left-[88px] top-[22px] h-6 w-14 bg-[#323b45]/28" />
								<span className="absolute left-[132px] top-[22px] h-6 w-14 bg-[#323b45]/28" />
								<span className="absolute left-[176px] top-[22px] h-6 w-14 bg-[#323b45]/28" />
							</div>
						</div>
					</div>
				</div>

				{/* Foreground content */}
				<div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-24">
					<div className="max-w-3xl animate-fade-up text-center">
						<p className="mb-5 text-[0.7rem] uppercase tracking-[0.28em] text-white/45">
							Software Engineer in the making
						</p>

						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-[0.04em]">
							<span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
								Hello, World.
							</span>
							<span className="block mt-4 text-white/85">I&apos;m Finn.</span>
						</h1>

						<p className="mt-6 text-white/55 max-w-xl mx-auto leading-relaxed">
							I build modern web apps, developer tools, and purposeful software experiences.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;

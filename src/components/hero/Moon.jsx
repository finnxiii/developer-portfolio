import moonImage from "../../assets/moon.png";

function Moon() {
	return (
		<>
			<div className="absolute right-[4%] top-[10%] h-40 w-40 rounded-full bg-white/[0.04] blur-[70px] sm:right-[6%] sm:top-[8%] sm:h-56 sm:w-56 sm:blur-[90px] md:h-64 md:w-64" />
			<div className="absolute right-[8%] top-[12%] h-24 w-24 animate-moon-pulse rounded-full bg-white/[0.05] blur-[30px] sm:right-[9%] sm:top-[11%] sm:h-32 sm:w-32 sm:blur-[40px] md:h-36 md:w-36" />
			<div className="absolute right-[8%] top-[12%] w-24 sm:right-[8%] sm:top-[10%] sm:w-32 md:w-40">
				<img
					src={moonImage}
					alt="moon"
					className="w-full animate-[floatMoon_6s_ease-in-out_infinite] object-contain opacity-95 drop-shadow-[0_0_22px_rgba(255,255,255,0.12)]"
				/>
			</div>
		</>
	);
}

export default Moon;

const row = (startX, top, count, width, height, gap, color) =>
	Array.from({ length: count }, (_, i) => ({
		left: startX + i * gap,
		top,
		width,
		height,
		color,
	}));

const cloud = ({
	wrapperClass,
	sizeClass,
	speed,
	moveX = 0,
	moveY = 0,
	scaleTo = 1.08,
	opacityFrom = 1,
	opacityTo = 1,
	rows,
}) => ({
	wrapperClass,
	sizeClass,
	speed,
	moveX,
	moveY,
	scaleTo,
	opacityFrom,
	opacityTo,
	blocks: rows.flat(),
});

export const stars = [
	{
		className: "left-[8%] top-[16%] h-[3px] w-[3px] animate-twinkle bg-white/80",
		style: { animationDelay: "0s", boxShadow: "0 0 6px rgba(255,255,255,0.22)" },
	},
	{ className: "left-[12%] top-[24%] h-[1.5px] w-[1.5px] bg-white/45" },
	{ className: "left-[15%] top-[28%] h-[2px] w-[2px] bg-white/55" },
	{ className: "left-[24%] top-[12%] h-[1.5px] w-[1.5px] bg-white/55" },
	{
		className: "left-[32%] top-[24%] h-[3px] w-[3px] animate-twinkle bg-white/75",
		style: { animationDelay: "0.8s", boxShadow: "0 0 6px rgba(255,255,255,0.22)" },
	},
	{ className: "left-[42%] top-[14%] h-[2px] w-[2px] bg-white/55" },
	{
		className: "left-[56%] top-[10%] h-[3px] w-[3px] animate-twinkle bg-white/88",
		style: { animationDelay: "1.6s", boxShadow: "0 0 6px rgba(255,255,255,0.22)" },
	},
	{ className: "left-[63%] top-[22%] h-[2px] w-[2px] bg-white/55" },
	{ className: "left-[72%] top-[14%] h-[1.5px] w-[1.5px] bg-white/45" },
	{
		className: "left-[82%] top-[24%] h-[3px] w-[3px] animate-twinkle bg-white/78",
		style: { animationDelay: "2.2s", boxShadow: "0 0 6px rgba(255,255,255,0.22)" },
	},
	{ className: "left-[90%] top-[17%] h-[2px] w-[2px] bg-white/55" },
	{ className: "left-[20%] top-[42%] h-[1.5px] w-[1.5px] bg-white/30" },
	{ className: "left-[40%] top-[44%] h-[1px] w-[1px] bg-white/20" },
	{ className: "left-[66%] top-[46%] h-[1px] w-[1px] bg-white/20" },
	{ className: "left-[78%] top-[40%] h-[1.5px] w-[1.5px] bg-white/28" },
];

export const mobileClouds = [
	cloud({
		wrapperClass: "left-[2%] top-[24%] animate-drift-right",
		sizeClass: "h-[64px] w-[168px]",
		speed: 0.05,
		moveX: 18,
		moveY: 12,
		rows: [row(22, 0, 3, 38, 20, 32, "bg-[#2d343c]/34"), row(0, 20, 4, 44, 20, 34, "bg-[#252c33]/30")],
	}),
	cloud({
		wrapperClass: "right-[0%] top-[34%] animate-drift-left",
		sizeClass: "h-[64px] w-[168px]",
		speed: 0.06,
		moveX: -18,
		moveY: 14,
		rows: [row(22, 0, 3, 38, 20, 32, "bg-[#2d343c]/28"), row(0, 20, 4, 44, 20, 34, "bg-[#252c33]/24")],
	}),
	cloud({
		wrapperClass: "left-[4%] bottom-[14%] animate-drift-left",
		sizeClass: "h-[72px] w-[184px]",
		speed: 0.14,
		moveX: 12,
		moveY: -40,
		scaleTo: 1.12,
		rows: [row(24, 0, 3, 42, 22, 34, "bg-[#3a444f]/34"), row(0, 22, 4, 48, 22, 38, "bg-[#323b45]/30")],
	}),
	cloud({
		wrapperClass: "right-[2%] bottom-[8%] animate-drift-right",
		sizeClass: "h-[72px] w-[184px]",
		speed: 0.16,
		moveX: -12,
		moveY: -46,
		scaleTo: 1.12,
		rows: [row(24, 0, 3, 42, 22, 34, "bg-[#3a444f]/34"), row(0, 22, 4, 48, 22, 38, "bg-[#323b45]/30")],
	}),
];

export const tabletClouds = [
	cloud({
		wrapperClass: "left-[2%] top-[20%] animate-drift-right",
		sizeClass: "h-[72px] w-[192px]",
		speed: 0.05,
		moveX: 20,
		moveY: 14,
		rows: [
			row(24, 0, 3, 42, 22, 36, "bg-[#2d343c]/34"),
			row(0, 22, 4, 48, 22, 38, "bg-[#252c33]/30"),
			row(50, 44, 2, 72, 18, 38, "bg-[#1d232a]/24"),
		],
	}),
	cloud({
		wrapperClass: "right-[2%] top-[24%] animate-drift-left",
		sizeClass: "h-[72px] w-[192px]",
		speed: 0.06,
		moveX: -20,
		moveY: 16,
		rows: [
			row(24, 0, 3, 42, 22, 36, "bg-[#313840]/30"),
			row(0, 22, 4, 48, 22, 38, "bg-[#2a3138]/26"),
			row(50, 44, 2, 72, 18, 38, "bg-[#1d232a]/20"),
		],
	}),
	cloud({
		wrapperClass: "left-[10%] top-[46%] animate-drift-left",
		sizeClass: "h-[64px] w-[168px]",
		speed: 0.1,
		moveX: 18,
		moveY: 22,
		rows: [row(22, 0, 2, 40, 20, 36, "bg-[#2d343c]/24"), row(0, 20, 4, 46, 20, 34, "bg-[#252c33]/20")],
	}),
	cloud({
		wrapperClass: "right-[10%] top-[54%] animate-drift-right",
		sizeClass: "h-[64px] w-[168px]",
		speed: 0.11,
		moveX: -18,
		moveY: 24,
		rows: [row(22, 0, 2, 40, 20, 36, "bg-[#2d343c]/22"), row(0, 20, 4, 46, 20, 34, "bg-[#252c33]/18")],
	}),
	cloud({
		wrapperClass: "left-1/2 bottom-[8%] -translate-x-1/2 animate-drift-left",
		sizeClass: "h-[80px] w-[220px]",
		speed: 0.18,
		moveY: -56,
		scaleTo: 1.16,
		rows: [
			row(24, 0, 4, 40, 22, 34, "bg-[#3a444f]/28"),
			row(0, 24, 5, 46, 22, 34, "bg-[#323b45]/26"),
			row(40, 48, 3, 64, 18, 40, "bg-[#252c33]/20"),
		],
	}),
];

export const laptopClouds = [
	cloud({
		wrapperClass: "left-[2%] top-[18%] animate-drift-right",
		sizeClass: "h-[88px] w-[240px]",
		speed: 0.05,
		moveX: 28,
		moveY: 18,
		scaleTo: 1.06,
		rows: [
			row(28, 0, 3, 50, 24, 42, "bg-[#2d343c]/36"),
			row(0, 24, 4, 56, 24, 44, "bg-[#252c33]/32"),
			row(54, 50, 2, 92, 20, 44, "bg-[#1d232a]/26"),
		],
	}),
	cloud({
		wrapperClass: "right-[1%] top-[20%] animate-drift-left",
		sizeClass: "h-[88px] w-[256px]",
		speed: 0.06,
		moveX: -28,
		moveY: 20,
		scaleTo: 1.06,
		rows: [
			row(30, 0, 3, 52, 24, 44, "bg-[#313840]/30"),
			row(0, 24, 4, 60, 24, 46, "bg-[#2a3138]/26"),
			row(58, 50, 2, 96, 20, 46, "bg-[#1d232a]/20"),
		],
	}),
	cloud({
		wrapperClass: "left-[8%] top-[42%] animate-drift-left",
		sizeClass: "h-[80px] w-[220px]",
		speed: 0.1,
		moveX: 20,
		moveY: 24,
		rows: [
			row(24, 0, 2, 46, 22, 40, "bg-[#2d343c]/26"),
			row(0, 22, 4, 52, 22, 40, "bg-[#252c33]/22"),
			row(44, 46, 2, 86, 18, 40, "bg-[#1d232a]/18"),
		],
	}),
	cloud({
		wrapperClass: "right-[8%] top-[50%] animate-drift-right",
		sizeClass: "h-[80px] w-[220px]",
		speed: 0.11,
		moveX: -20,
		moveY: 28,
		rows: [
			row(24, 0, 2, 46, 22, 40, "bg-[#2d343c]/24"),
			row(0, 22, 4, 52, 22, 40, "bg-[#252c33]/20"),
			row(44, 46, 2, 86, 18, 40, "bg-[#1d232a]/16"),
		],
	}),
	cloud({
		wrapperClass: "left-[2%] bottom-[12%] animate-drift-right",
		sizeClass: "h-[104px] w-[300px]",
		speed: 0.16,
		moveX: 34,
		moveY: -78,
		scaleTo: 1.18,
		opacityFrom: 0.9,
		opacityTo: 1,
		rows: [
			row(30, 0, 4, 56, 26, 46, "bg-[#3a444f]/38"),
			row(0, 28, 5, 64, 26, 48, "bg-[#323b45]/34"),
			row(52, 58, 3, 96, 20, 46, "bg-[#252c33]/26"),
		],
	}),
	cloud({
		wrapperClass: "left-1/2 bottom-[6%] -translate-x-1/2 animate-drift-left",
		sizeClass: "h-[112px] w-[340px]",
		speed: 0.18,
		moveY: -96,
		scaleTo: 1.22,
		opacityFrom: 0.9,
		opacityTo: 1,
		rows: [
			row(34, 0, 5, 58, 26, 48, "bg-[#3a444f]/36"),
			row(0, 30, 5, 66, 26, 54, "bg-[#323b45]/32"),
			row(48, 62, 4, 92, 20, 50, "bg-[#252c33]/24"),
		],
	}),
	cloud({
		wrapperClass: "right-[2%] bottom-[10%] animate-drift-right",
		sizeClass: "h-[104px] w-[300px]",
		speed: 0.17,
		moveX: -34,
		moveY: -84,
		scaleTo: 1.18,
		opacityFrom: 0.9,
		opacityTo: 1,
		rows: [
			row(30, 0, 4, 56, 26, 46, "bg-[#3a444f]/38"),
			row(0, 28, 5, 64, 26, 48, "bg-[#323b45]/34"),
			row(52, 58, 3, 96, 20, 46, "bg-[#252c33]/26"),
		],
	}),
];

export const desktopClouds = [
	...laptopClouds,
	cloud({
		wrapperClass: "left-[-2%] top-[14%] animate-drift-right",
		sizeClass: "h-[80px] w-[220px]",
		speed: 0.04,
		moveX: 22,
		moveY: 18,
		rows: [
			row(24, 0, 2, 44, 22, 38, "bg-[#2d343c]/24"),
			row(0, 22, 3, 50, 22, 38, "bg-[#252c33]/20"),
			row(38, 46, 2, 78, 18, 38, "bg-[#1d232a]/16"),
		],
	}),
	cloud({
		wrapperClass: "right-[-2%] top-[66%] animate-drift-left",
		sizeClass: "h-[84px] w-[240px]",
		speed: 0.15,
		moveX: -22,
		moveY: -40,
		rows: [
			row(24, 0, 3, 46, 22, 40, "bg-[#323b45]/26"),
			row(0, 22, 4, 52, 22, 40, "bg-[#2b333c]/22"),
			row(42, 46, 2, 86, 18, 40, "bg-[#252c33]/16"),
		],
	}),
];

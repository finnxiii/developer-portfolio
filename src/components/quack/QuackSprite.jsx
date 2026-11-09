// Pixel data generated once at module level — not on every render
const DROWS = [
	"............",
	".....YYYY...",
	"....YYYYYY..",
	"....YWKYYYOO",
	"....YYYYYYOO",
	".....YYYY...",
	".YYYYYYYYYY.",
	"YYYDDDDYYYY.",
	"YYYYDDDYYYY.",
	".YYYYYYYYYY.",
	"..YYYYYYYY..",
	"............",
];
const DCOL = { Y: "#F2C230", D: "#D9A21E", O: "#E8862A", W: "#FFFFFF" };
const CELL = 64 / 12;

const headData = [];
const bodyData = [];
const wingData = [];

DROWS.forEach((row, y) => {
	row.split("").forEach((ch, x) => {
		if (ch === ".") return;
		const rx = x * CELL;
		const ry = y * CELL;
		if (y <= 5) {
			// K is the eye pixel — render as Y; eye element overlays it with black
			const fill = ch === "K" ? DCOL.Y : (DCOL[ch] ?? DCOL.Y);
			headData.push({ x: rx, y: ry, fill });
		}
		if (y >= 6) {
			bodyData.push({ x: rx, y: ry, fill: DCOL.Y });
		}
		if (ch === "D") {
			wingData.push({ x: rx, y: ry, fill: DCOL.D });
		}
	});
});

function Layer({ data }) {
	return (
		<svg
			width="64"
			height="64"
			viewBox="0 0 64 64"
			aria-hidden="true"
			className="quack__sprite"
		>
			{data.map((r, i) => (
				<rect key={i} x={r.x} y={r.y} width={CELL} height={CELL} fill={r.fill} />
			))}
		</svg>
	);
}

export function HeadLayer() {
	return <Layer data={headData} />;
}
export function BodyLayer() {
	return <Layer data={bodyData} />;
}
export function WingLayer() {
	return <Layer data={wingData} />;
}

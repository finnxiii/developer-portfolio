import { useEffect, useRef } from "react";
import SectionBlock, { RvWrap } from "../../components/ui/SectionBlock";
import { skillsMeta, skills } from "../../data";
import { useReveal } from "../../hooks/useReveal";
import "./Skills.scss";

export default function Skills() {
	useReveal();
	return (
		<SectionBlock id="skills" label={skillsMeta.heading} tagline={skillsMeta.tagline}>
			<RvWrap delay=".1s">
				<div className="skills__grid">
					{skills.map((cat) => (
						<SkillBox key={cat.category} cat={cat} />
					))}
				</div>
			</RvWrap>
		</SectionBlock>
	);
}

// approximate tag dimensions for overlap calculation
function approxW(text, fs, px) {
	return text.length * fs * 0.55 + px * 2 + 4;
}
function approxH(fs, py) {
	return fs * 1.5 + py * 2;
}

function tierProps(tier) {
	if (tier === 0) return { px: 22, py: 10, fs: 16 };
	if (tier === 1) return { px: 14, py: 6, fs: 12 };
	return { px: 11, py: 4, fs: 10 };
}

function getTier(i, total) {
	if (i === 0) return 0;
	return i / (total - 1) <= 0.35 ? 1 : 2;
}

function placeNoOverlap(items, canvasW) {
	const cx = canvasW / 2;
	const total = items.length;
	const goldenAngle = Math.PI * (3 - Math.sqrt(5));
	const maxR = canvasW * 0.32; // tighter radius so tags stay inside

	const sizes = items.map((label, i) => {
		const tier = getTier(i, total);
		const { px, py, fs } = tierProps(tier);
		return { w: approxW(label, fs, px), h: approxH(fs, py), tier };
	});

	const positions = items.map((_, i) => {
		if (i === 0) return { x: cx, y: cx };
		const r = maxR * Math.sqrt(i / (total - 1));
		const theta = i * goldenAngle;
		return { x: cx + r * Math.cos(theta), y: cx + r * Math.sin(theta) };
	});

	// force relaxation
	for (let iter = 0; iter < 160; iter++) {
		for (let a = 0; a < total; a++) {
			for (let b = a + 1; b < total; b++) {
				const pa = positions[a],
					pb = positions[b];
				const sa = sizes[a],
					sb = sizes[b];
				const minDx = (sa.w + sb.w) / 2 + 8;
				const minDy = (sa.h + sb.h) / 2 + 8;
				const dx = pb.x - pa.x;
				const dy = pb.y - pa.y;
				const overlapX = minDx - Math.abs(dx);
				const overlapY = minDy - Math.abs(dy);

				if (overlapX > 0 && overlapY > 0) {
					const pushX = overlapX < overlapY ? overlapX / 2 : 0;
					const pushY = overlapY <= overlapX ? overlapY / 2 : 0;
					const signX = dx >= 0 ? 1 : -1;
					const signY = dy >= 0 ? 1 : -1;

					if (a === 0) {
						pb.x += pushX * signX * 2;
						pb.y += pushY * signY * 2;
					} else if (b === 0) {
						pa.x -= pushX * signX * 2;
						pa.y -= pushY * signY * 2;
					} else {
						pa.x -= pushX * signX;
						pa.y -= pushY * signY;
						pb.x += pushX * signX;
						pb.y += pushY * signY;
					}
				}
			}
		}
	}

	// clamp all positions to stay within container bounds
	positions.forEach((p, i) => {
		const hw = sizes[i].w / 2 + 6;
		p.x = Math.max(hw, Math.min(canvasW - hw, p.x));
	});

	// shift vertically so content starts at top
	let minY = Infinity,
		maxY = -Infinity;
	positions.forEach((p, i) => {
		minY = Math.min(minY, p.y - sizes[i].h / 2);
		maxY = Math.max(maxY, p.y + sizes[i].h / 2);
	});
	const pad = 14;
	const offsetY = pad - minY;
	positions.forEach((p) => {
		p.y += offsetY;
	});
	const totalH = maxY - minY + pad * 2;

	return { positions, sizes, totalH };
}

function SkillBox({ cat }) {
	const wrapRef = useRef(null);

	useEffect(() => {
		function layout() {
			const wrap = wrapRef.current;
			if (!wrap) return;

			// clear previous tags
			wrap.innerHTML = "";

			const W = wrap.offsetWidth || 300;
			const { positions, sizes, totalH } = placeNoOverlap(cat.items, W);
			wrap.style.height = totalH + "px";

			cat.items.forEach((label, i) => {
				const tier = sizes[i].tier;
				const tag = document.createElement("div");
				tag.className = `skill-tag skill-tag--${tier}`;
				tag.textContent = label;
				tag.style.left = positions[i].x + "px";
				tag.style.top = positions[i].y + "px";
				wrap.appendChild(tag);
			});
		}

		layout();

		const ro = new ResizeObserver(layout);
		if (wrapRef.current) ro.observe(wrapRef.current);
		return () => ro.disconnect();
	}, [cat.items]);

	return (
		<div className="skill-box">
			<div className="skill-box__header">
				<div className="skill-box__bar" />
				<span className="skill-box__title">{cat.category}</span>
			</div>
			<div className="skill-box__area" ref={wrapRef} />
		</div>
	);
}

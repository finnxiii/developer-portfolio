import { useRef, useEffect } from "react";
import SectionBlock, { RvWrap } from "../../components/ui/SectionBlock";
import { skills } from "../../data";
import { useReveal } from "../../hooks/useReveal";
import { CAT_COLOURS } from "../../constants";
import "./Skills.scss";

export default function Skills() {
	useReveal();
	return (
		<SectionBlock id="skills" label="Skills">
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

function SkillBox({ cat }) {
	const areaRef = useRef(null);
	const colour = CAT_COLOURS[cat.category] ?? "var(--c-blue)";
	const positions = useRef(
		cat.items.map((_, i) => {
			const cols = 3;
			const row = Math.floor(i / cols);
			const col = i % cols;
			return {
				lx: 10 + col * 72 + (Math.random() * 10 - 5),
				ly: 8 + row * 50 + (Math.random() * 8 - 4),
			};
		}),
	);

	useEffect(() => {
		const area = areaRef.current;
		if (!area) return;
		const tags = area.querySelectorAll(".dtag");
		const cleanups = [];

		tags.forEach((el) => {
			let px = parseFloat(el.style.left);
			let py = parseFloat(el.style.top);
			let vx = 0,
				vy = 0;
			let dragging = false;
			let sx = 0,
				sy = 0;
			let lastPx = px,
				lastPy = py;
			let animId = null;

			const aW = () => area.clientWidth;
			const aH = () => area.clientHeight;
			const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

			function loop() {
				if (dragging) {
					animId = null;
					return;
				}
				vx *= 0.87;
				vy *= 0.87;
				px += vx;
				py += vy;
				const elW = el.offsetWidth || 60;
				const elH = el.offsetHeight || 24;
				if (px < 0) {
					px = 0;
					vx *= -0.62;
				}
				if (px > aW() - elW) {
					px = aW() - elW;
					vx *= -0.62;
				}
				if (py < 0) {
					py = 0;
					vy *= -0.62;
				}
				if (py > aH() - elH) {
					py = aH() - elH;
					vy *= -0.62;
				}
				el.style.left = px + "px";
				el.style.top = py + "px";
				if (Math.abs(vx) > 0.25 || Math.abs(vy) > 0.25) {
					animId = requestAnimationFrame(loop);
				} else {
					animId = null;
				}
			}

			const onMouseDown = (e) => {
				dragging = true;
				sx = e.clientX - px;
				sy = e.clientY - py;
				lastPx = px;
				lastPy = py;
				if (animId) {
					cancelAnimationFrame(animId);
					animId = null;
				}
				let max = 0;
				area.querySelectorAll(".dtag").forEach((t) => {
					max = Math.max(max, parseInt(t.style.zIndex) || 1);
				});
				el.style.zIndex = max + 1;
				el.style.transform = "scale(1.07)";
				e.preventDefault();
			};

			const onMouseMove = (e) => {
				if (!dragging) return;
				const npx = e.clientX - sx;
				const npy = e.clientY - sy;
				vx = (npx - lastPx) * 0.6;
				vy = (npy - lastPy) * 0.6;
				lastPx = px;
				lastPy = py;
				const elW = el.offsetWidth || 60;
				const elH = el.offsetHeight || 24;
				px = clamp(npx, 0, aW() - elW);
				py = clamp(npy, 0, aH() - elH);
				el.style.left = px + "px";
				el.style.top = py + "px";
			};

			const onMouseUp = () => {
				if (!dragging) return;
				dragging = false;
				el.style.transform = "";
				if (Math.abs(vx) > 0.4 || Math.abs(vy) > 0.4) {
					animId = requestAnimationFrame(loop);
				}
			};

			el.addEventListener("mousedown", onMouseDown);
			document.addEventListener("mousemove", onMouseMove);
			document.addEventListener("mouseup", onMouseUp);

			cleanups.push(() => {
				el.removeEventListener("mousedown", onMouseDown);
				document.removeEventListener("mousemove", onMouseMove);
				document.removeEventListener("mouseup", onMouseUp);
				if (animId) cancelAnimationFrame(animId);
			});
		});

		return () => cleanups.forEach((fn) => fn());
	}, []);

	return (
		<div className="skill-box">
			<div className="skill-box__header">
				<div className="skill-box__bar" style={{ background: colour }} />
				<span className="skill-box__title">{cat.category}</span>
			</div>
			<div className="skill-box__area" ref={areaRef}>
				{cat.items.map((item, i) => (
					<div
						key={item.label}
						className="dtag"
						style={{
							left: `${positions.current[i].lx}px`,
							top: `${positions.current[i].ly}px`,
							zIndex: 1,
						}}
					>
						{item.label}
					</div>
				))}
			</div>
		</div>
	);
}

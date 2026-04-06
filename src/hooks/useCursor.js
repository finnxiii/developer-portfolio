import { useEffect } from "react";

export function useCursor() {
	useEffect(() => {
		const dot = document.getElementById("cursor-dot");
		const ring = document.getElementById("cursor-ring");
		if (!dot || !ring) return;

		let mouseX = 0,
			mouseY = 0;
		let ringX = 0,
			ringY = 0;
		let raf;

		const onMove = (e) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
			dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
		};

		const onEnter = () => {
			dot.style.opacity = "1";
			ring.style.opacity = "1";
		};

		const onLeave = () => {
			dot.style.opacity = "0";
			ring.style.opacity = "0";
		};

		/* hover — grow ring on interactive elements */
		const onHoverIn = () => {
			ring.classList.add("cursor-ring--hover");
			dot.classList.add("cursor-dot--hover");
		};
		const onHoverOut = () => {
			ring.classList.remove("cursor-ring--hover");
			dot.classList.remove("cursor-dot--hover");
		};

		/* attach hover listeners to all interactive elements */
		const targets = document.querySelectorAll("a, button, .proj-card, .skill-box, .clink, .dtag, .liquid-btn");
		targets.forEach((el) => {
			el.addEventListener("mouseenter", onHoverIn);
			el.addEventListener("mouseleave", onHoverOut);
		});

		/* smooth ring follow with lerp */
		function loop() {
			ringX += (mouseX - ringX) * 0.12;
			ringY += (mouseY - ringY) * 0.12;
			ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
			raf = requestAnimationFrame(loop);
		}

		document.addEventListener("mousemove", onMove);
		document.addEventListener("mouseenter", onEnter);
		document.addEventListener("mouseleave", onLeave);
		raf = requestAnimationFrame(loop);

		return () => {
			document.removeEventListener("mousemove", onMove);
			document.removeEventListener("mouseenter", onEnter);
			document.removeEventListener("mouseleave", onLeave);
			targets.forEach((el) => {
				el.removeEventListener("mouseenter", onHoverIn);
				el.removeEventListener("mouseleave", onHoverOut);
			});
			cancelAnimationFrame(raf);
		};
	}, []);
}

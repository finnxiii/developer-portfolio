import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { askQuack } from "../../lib/quack";
import { useQuack } from "./QuackContext";
import { BodyLayer, HeadLayer, WingLayer } from "./QuackSprite";
import "./quack.scss";

const ACTS = ["idle", "peck", "look", "flap", "waddle", "idle", "peck", "look"];
const GREETING =
	"Hi, I'm Quack, Finn's rubber duck. Ask me about his projects or placements.";
const IDLE_MS = 2600;
const BUBBLE_MS = 3500;
const ENTER_DELAY_MS = 1200;
const MARGIN = 8;

function duckSize() { return window.innerWidth < 600 ? 52 : 64; }
function topClear() { return window.innerWidth < 600 ? 56 : 0; }

function clampBounds() {
	const vw = window.innerWidth;
	const vh = window.innerHeight;
	const duck = duckSize();
	const top = topClear();
	return {
		minX: MARGIN,
		maxX: vw - duck - MARGIN,
		minY: top + MARGIN,
		maxY: vh - duck - MARGIN,
	};
}

// Returns { fx, fy } clamped to viewport, or null if position is invalid / viewport too small.
function clampFraction(fx, fy) {
	if (!Number.isFinite(fx) || !Number.isFinite(fy)) return null;
	const vw = window.innerWidth;
	const vh = window.innerHeight;
	const { minX, maxX, minY, maxY } = clampBounds();
	if (maxX < minX || maxY < minY) return null;
	const x = Math.max(minX, Math.min(maxX, fx * vw));
	const y = Math.max(minY, Math.min(maxY, fy * vh));
	return { fx: x / vw, fy: y / vh };
}

function loadSavedPos() {
	try {
		const saved = sessionStorage.getItem("quack-pos");
		if (!saved) return null;
		const p = JSON.parse(saved);
		let fx, fy;
		if (typeof p.fx === "number" && typeof p.fy === "number") {
			fx = p.fx; fy = p.fy;
		} else if (typeof p.x === "number" && typeof p.y === "number") {
			// Migrate old pixel format
			fx = p.x / window.innerWidth;
			fy = p.y / window.innerHeight;
		} else {
			return null;
		}
		const clamped = clampFraction(fx, fy);
		if (clamped) {
			try { sessionStorage.setItem("quack-pos", JSON.stringify(clamped)); } catch { /**/ }
			return clamped;
		}
	} catch { /**/ }
	return null;
}

export default function Quack() {
	const reducedMotion = useReducedMotion();
	const {
		quips, pending, chatWanted, resetPosReq,
		clearPending, clearChatWanted, clearResetPos,
	} = useQuack();

	// Position: null = default bottom-right via CSS; stored as { fx, fy } fractions.
	const [pos, setPosState] = useState(() => loadSavedPos());
	const posRef = useRef(pos);
	const setPos = useCallback((p) => {
		posRef.current = p;
		setPosState(p);
	}, []);

	const [facing, setFacing] = useState(1);
	const [act, setAct] = useState("idle");
	const [actN, setActN] = useState(0);
	const [hopN, setHopN] = useState(0);
	const [quipN, setQuipN] = useState(0);
	const [quipOverride, setQuipOverride] = useState(null);
	const [bubble, setBubble] = useState(false);
	const [chatOpen, setChatOpen] = useState(false);
	const [msgs, setMsgs] = useState([{ who: "duck", text: GREETING }]);
	const [draft, setDraft] = useState("");
	const [isDragging, setIsDragging] = useState(false);

	const dragRef = useRef(null);
	const bubbleTimerRef = useRef(null);
	const idleTimerRef = useRef(null);
	const rafRef = useRef(null);
	const resizeRafRef = useRef(null);
	const mxRef = useRef(0.5);
	const myRef = useRef(0.5);
	const wrapRef = useRef(null);
	const chatScrollRef = useRef(null);

	// Initial bubble after entrance + idle timer
	useEffect(() => {
		const enterTimer = setTimeout(() => {
			setBubble(true);
			bubbleTimerRef.current = setTimeout(() => setBubble(false), BUBBLE_MS);
		}, ENTER_DELAY_MS);

		if (!reducedMotion) {
			idleTimerRef.current = setInterval(() => {
				if (dragRef.current) return;
				setAct(ACTS[Math.floor(Math.random() * ACTS.length)]);
				setActN((n) => n + 1);
			}, IDLE_MS);
		}

		return () => {
			clearTimeout(enterTimer);
			clearTimeout(bubbleTimerRef.current);
			clearInterval(idleTimerRef.current);
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, [reducedMotion]);

	// Clamp position on viewport resize and orientationchange (rAF-throttled)
	useEffect(() => {
		const handle = () => {
			if (resizeRafRef.current) return;
			resizeRafRef.current = requestAnimationFrame(() => {
				resizeRafRef.current = null;
				const p = posRef.current;
				if (!p) return;
				const clamped = clampFraction(p.fx, p.fy);
				if (!clamped) {
					setPos(null);
					try { sessionStorage.removeItem("quack-pos"); } catch { /**/ }
				} else {
					// Always call setPos (new object) so posStyle pixels update
					setPos({ fx: clamped.fx, fy: clamped.fy });
				}
			});
		};
		window.addEventListener("resize", handle, { passive: true });
		window.addEventListener("orientationchange", handle, { passive: true });
		return () => {
			window.removeEventListener("resize", handle);
			window.removeEventListener("orientationchange", handle);
			if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
		};
	}, [setPos]);

	// Pause idle timer when tab is hidden
	useEffect(() => {
		const handleVisibility = () => {
			if (document.hidden) {
				clearInterval(idleTimerRef.current);
				idleTimerRef.current = null;
			} else if (!reducedMotion && !idleTimerRef.current) {
				idleTimerRef.current = setInterval(() => {
					if (dragRef.current) return;
					setAct(ACTS[Math.floor(Math.random() * ACTS.length)]);
					setActN((n) => n + 1);
				}, IDLE_MS);
			}
		};
		document.addEventListener("visibilitychange", handleVisibility);
		return () =>
			document.removeEventListener("visibilitychange", handleVisibility);
	}, [reducedMotion]);

	// Pointer tracking: facing + head tilt (rAF-throttled, no re-render for tilt)
	useEffect(() => {
		if (reducedMotion) return;
		const handleMove = (e) => {
			mxRef.current = e.clientX / window.innerWidth;
			myRef.current = e.clientY / window.innerHeight;
			if (rafRef.current) return;
			rafRef.current = requestAnimationFrame(() => {
				rafRef.current = null;
				const vw = window.innerWidth;
				const vh = window.innerHeight;
				const p = posRef.current;
				const dcx = p ? p.fx * vw + 32 : vw - 52;
				const dcy = p ? p.fy * vh + 32 : vh - 52;

				const newFacing = mxRef.current * vw < dcx ? -1 : 1;
				setFacing((prev) => (prev !== newFacing ? newFacing : prev));

				const tiltRaw = (myRef.current * vh - dcy) / 30;
				const tilt = Math.max(-14, Math.min(10, tiltRaw));
				wrapRef.current?.style.setProperty(
					"--duck-tilt",
					`${tilt.toFixed(1)}deg`
				);
			});
		};
		document.addEventListener("pointermove", handleMove, { passive: true });
		return () => {
			document.removeEventListener("pointermove", handleMove);
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
				rafRef.current = null;
			}
		};
	}, [reducedMotion]);

	// React to say() from context
	useEffect(() => {
		if (!pending) return;
		const text = pending;
		clearPending();
		clearTimeout(bubbleTimerRef.current);
		const t = setTimeout(() => {
			setQuipOverride(text);
			setBubble(true);
			bubbleTimerRef.current = setTimeout(() => {
				setBubble(false);
				setQuipOverride(null);
			}, BUBBLE_MS);
		}, 0);
		return () => clearTimeout(t);
	}, [pending, clearPending]);

	// React to openChat() from context
	useEffect(() => {
		if (!chatWanted) return;
		clearChatWanted();
		const t = setTimeout(() => setChatOpen(true), 0);
		return () => clearTimeout(t);
	}, [chatWanted, clearChatWanted]);

	// React to requestResetPos() from Logo double-click
	useEffect(() => {
		if (!resetPosReq) return;
		clearResetPos();
		try { sessionStorage.removeItem("quack-pos"); } catch { /**/ }
		const t = setTimeout(() => {
			setPos(null);
			// Restart entrance animation via reflow trick
			const el = wrapRef.current;
			if (el && !reducedMotion) {
				el.style.animation = "none";
				void el.getBoundingClientRect();
				el.style.animation = "";
			}
		}, 0);
		return () => clearTimeout(t);
	}, [resetPosReq, clearResetPos, setPos, reducedMotion]);

	// Scroll chat to bottom when new message arrives
	useEffect(() => {
		if (chatScrollRef.current) {
			chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
		}
	}, [msgs]);

	// ── Drag handlers ─────────────────────────────────────────────────

	const duckDown = useCallback(
		(e) => {
			e.currentTarget.setPointerCapture(e.pointerId);
			const wrap = wrapRef.current;
			let startX, startY;
			if (posRef.current) {
				startX = posRef.current.fx * window.innerWidth;
				startY = posRef.current.fy * window.innerHeight;
			} else {
				const rect = wrap?.getBoundingClientRect() ?? {
					left: window.innerWidth - 92,
					top: window.innerHeight - 72,
				};
				startX = rect.left;
				startY = rect.top;
				const vw = window.innerWidth;
				const vh = window.innerHeight;
				posRef.current = { fx: startX / vw, fy: startY / vh };
				setPosState({ fx: startX / vw, fy: startY / vh });
			}
			dragRef.current = {
				ox: e.clientX - startX,
				oy: e.clientY - startY,
				sx: e.clientX,
				sy: e.clientY,
				moved: false,
			};
		},
		[]
	);

	const duckMove = useCallback(
		(e) => {
			const d = dragRef.current;
			if (!d) return;
			const moved =
				d.moved ||
				Math.abs(e.clientX - d.sx) + Math.abs(e.clientY - d.sy) > 5;
			dragRef.current = { ...d, moved };
			if (moved) setIsDragging(true);
			const vw = window.innerWidth;
			const vh = window.innerHeight;
			const { minX, maxX, minY, maxY } = clampBounds();
			const x = Math.max(minX, Math.min(maxX, e.clientX - d.ox));
			const y = Math.max(minY, Math.min(maxY, e.clientY - d.oy));
			const newPos = { fx: x / vw, fy: y / vh };
			posRef.current = newPos;
			setPosState(newPos);
		},
		[]
	);

	const duckUp = useCallback(
		(e) => {
			e.currentTarget.releasePointerCapture(e.pointerId);
			const d = dragRef.current;
			dragRef.current = null;
			setIsDragging(false);
			if (!d) return;
			if (!d.moved) {
				clearTimeout(bubbleTimerRef.current);
				setHopN((n) => n + 1);
				setQuipN((n) => n + 1);
				setQuipOverride(null);
				setBubble(true);
				setAct("flap");
				setActN((n) => n + 1);
				bubbleTimerRef.current = setTimeout(() => setBubble(false), BUBBLE_MS);
			} else {
				try {
					const p = posRef.current;
					if (p) sessionStorage.setItem("quack-pos", JSON.stringify({ fx: p.fx, fy: p.fy }));
				} catch { /**/ }
			}
		},
		[]
	);

	const handleKeyDown = useCallback(
		(e) => {
			const STEP = 24;
			let dx = 0, dy = 0;
			if (e.key === "ArrowLeft") dx = -STEP;
			else if (e.key === "ArrowRight") dx = STEP;
			else if (e.key === "ArrowUp") dy = -STEP;
			else if (e.key === "ArrowDown") dy = STEP;
			else return;
			e.preventDefault();
			const vw = window.innerWidth;
			const vh = window.innerHeight;
			const p = posRef.current ?? (() => {
				const rect = wrapRef.current?.getBoundingClientRect();
				return rect
					? { fx: rect.left / vw, fy: rect.top / vh }
					: { fx: (vw - 92) / vw, fy: (vh - 72) / vh };
			})();
			const { minX, maxX, minY, maxY } = clampBounds();
			const curX = p.fx * vw;
			const curY = p.fy * vh;
			const newX = Math.max(minX, Math.min(maxX, curX + dx));
			const newY = Math.max(minY, Math.min(maxY, curY + dy));
			const newPos = { fx: newX / vw, fy: newY / vh };
			setPos(newPos);
			try {
				sessionStorage.setItem("quack-pos", JSON.stringify(newPos));
			} catch { /**/ }
		},
		[setPos]
	);

	const toggleChat = useCallback(() => {
		setChatOpen((o) => !o);
		setBubble(false);
	}, []);

	const send = useCallback(
		async (e) => {
			e.preventDefault();
			const q = draft.trim();
			if (!q) return;
			setDraft("");
			setMsgs((m) => [...m, { who: "me", text: q }]);
			const reply = await askQuack(q);
			setMsgs((m) => [...m, { who: "duck", text: reply }]);
		},
		[draft]
	);

	// ── Computed animation values ──────────────────────────────────────

	const k = actN % 2 ? "A" : "B";
	const hopAnim =
		hopN && !reducedMotion
			? `quack-${hopN % 2 ? "hopA" : "hopB"} 520ms ease-out`
			: "none";
	const bodyAnim =
		!reducedMotion && act === "waddle"
			? `quack-waddle${k} 900ms ease-in-out`
			: "none";
	const wingAnim = !reducedMotion
		? isDragging
			? "quack-flapA 420ms ease-in-out infinite"
			: act === "flap"
				? `quack-flap${k} 750ms ease-in-out`
				: "none"
		: "none";
	const headAnim = !reducedMotion
		? act === "peck"
			? `quack-peck${k} 900ms ease-in-out`
			: act === "look"
				? `quack-look${k} 1700ms ease-in-out`
				: "none"
		: "none";

	const dShadowScale = isDragging ? 1.35 : 1;
	const dShadowOp = isDragging ? 0.5 : 1;
	const currentQuip =
		quipOverride ?? quips[quipN % Math.max(1, quips.length)] ?? "";

	const posStyle = pos
		? { left: `${pos.fx * window.innerWidth}px`, top: `${pos.fy * window.innerHeight}px` }
		: {};

	return (
		<div ref={wrapRef} className="quack" style={posStyle}>
			{/* Chat dialog */}
			{chatOpen && (
				<div
					role="dialog"
					aria-label="Ask Quack"
					className="quack__chat"
				>
					<div className="quack__chat-header">
						<span className="quack__chat-title">Ask Quack</span>
						<button
							type="button"
							onClick={toggleChat}
							aria-label="Close chat"
							className="quack__chat-close"
						>
							×
						</button>
					</div>
					<div
						ref={chatScrollRef}
						className="quack__chat-msgs"
						aria-live="polite"
					>
						{msgs.map((m, i) => (
							<div
								key={i}
								className={`quack__msg quack__msg--${m.who}`}
							>
								{m.text}
							</div>
						))}
					</div>
					<form onSubmit={send} className="quack__chat-form">
						<label htmlFor="quack-q" className="sr-only">
							Your question
						</label>
						<input
							id="quack-q"
							type="text"
							value={draft}
							onChange={(e) => setDraft(e.target.value)}
							placeholder="Ask about Vigil, placements…"
							className="quack__chat-input"
							autoComplete="off"
						/>
						<button type="submit" className="quack__chat-send">
							Ask
						</button>
					</form>
				</div>
			)}

			{/* Speech bubble */}
			{bubble && currentQuip && (
				<div
					aria-live="polite"
					className="quack__bubble"
					role="status"
				>
					{currentQuip}
				</div>
			)}

			{/* Duck row: ask button + duck button */}
			<div className="quack__row">
				<button
					type="button"
					className={`quack__ask${bubble || chatOpen ? " quack__ask--on" : ""}`}
					onClick={toggleChat}
					aria-label="Ask Quack a question"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						aria-hidden="true"
					>
						<path
							d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v6a1.5 1.5 0 0 1-1.5 1.5H7l-3 3v-3h-.5A1.5 1.5 0 0 1 2 9.5z"
							fill="none"
							stroke="#24221F"
							strokeWidth="1.5"
							strokeLinejoin="round"
						/>
						<circle cx="5.5" cy="6.5" r="0.9" fill="#24221F" />
						<circle cx="8" cy="6.5" r="0.9" fill="#24221F" />
						<circle cx="10.5" cy="6.5" r="0.9" fill="#24221F" />
					</svg>
				</button>

				<button
					type="button"
					className="quack__btn"
					aria-label="Quack, the rubber duck. Click to quack, drag to move him."
					onPointerDown={duckDown}
					onPointerMove={duckMove}
					onPointerUp={duckUp}
					onPointerCancel={duckUp}
					onKeyDown={handleKeyDown}
					style={{ cursor: isDragging ? "grabbing" : "grab" }}
				>
					<span
						className="quack__shadow"
						style={{
							transform: `scale(${dShadowScale})`,
							opacity: dShadowOp,
						}}
					/>
					<span className="quack__lift">
						<span
							className="quack__drag"
							style={{
								transform: isDragging
									? "translateY(-10px) rotate(-8deg) scale(1.1)"
									: "none",
							}}
						>
							<span style={{ display: "block", animation: hopAnim }}>
								<span
									className="quack__flip"
									style={{ transform: `scaleX(${facing})` }}
								>
									<span
										className="quack__body"
										style={{ animation: bodyAnim }}
									>
										<BodyLayer />
										<span
											className="quack__wing"
											style={{ animation: wingAnim }}
										>
											<WingLayer />
										</span>
										<span className="quack__head">
											<span
												className="quack__head-anim"
												style={{ animation: headAnim }}
											>
												<HeadLayer />
												<span className="quack__eye" />
											</span>
										</span>
									</span>
								</span>
							</span>
						</span>
					</span>
				</button>
			</div>
		</div>
	);
}

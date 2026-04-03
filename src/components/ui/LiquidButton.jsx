import "./LiquidButton.css";

export default function LiquidButton({ children, onClick }) {
	return (
		<button className="liquid-btn" onClick={onClick}>
			<span className="liquid-btn__label">{children}</span>
		</button>
	);
}

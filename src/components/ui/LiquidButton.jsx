import "./LiquidButton.css";

export default function LiquidButton({ children, onClick, href }) {
	if (href) {
		return (
			<a href={href} target="_blank" rel="noreferrer" className="liquid-btn">
				<span className="liquid-btn__label">{children}</span>
			</a>
		);
	}

	return (
		<button className="liquid-btn" onClick={onClick}>
			<span className="liquid-btn__label">{children}</span>
		</button>
	);
}

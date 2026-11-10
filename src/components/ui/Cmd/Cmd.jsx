import "./Cmd.scss";

export default function Cmd({
	glyph,
	variant = "default",
	href,
	target,
	rel,
	onClick,
	type = "button",
	disabled,
	className = "",
	children,
	...rest
}) {
	const cls = ["cmd", variant !== "default" ? `cmd--${variant}` : "", className]
		.filter(Boolean)
		.join(" ");

	if (href) {
		return (
			<a href={href} className={cls} target={target} rel={rel} {...rest}>
				{glyph && <span className="cmd__glyph" aria-hidden="true">{glyph}</span>}
				{children}
			</a>
		);
	}
	return (
		<button type={type} className={cls} onClick={onClick} disabled={disabled} {...rest}>
			{glyph && <span className="cmd__glyph" aria-hidden="true">{glyph}</span>}
			{children}
		</button>
	);
}

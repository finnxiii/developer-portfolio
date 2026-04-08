import "./SectionBlock.scss";

export function RvWrap({ children, delay }) {
	return (
		<div className="rv-wrap">
			<div className="rv" data-reveal-delay={delay ? delay.replace("s", "") : "0"}>
				{children}
			</div>
		</div>
	);
}

export default function SectionBlock({ id, label, tagline, children, className = "" }) {
	return (
		<section id={id} className={`section ${className}`}>
			<div className="section__divider" />
			<div className="section__header">
				{label && (
					<div className="rv-wrap">
						<p className="section__label rv">{label}</p>
					</div>
				)}
				{tagline && (
					<div className="rv-wrap">
						<p className="section__tagline rv">{tagline}</p>
					</div>
				)}
			</div>
			<div className="section__body">{children}</div>
		</section>
	);
}

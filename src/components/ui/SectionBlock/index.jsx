import "./SectionBlock.scss";

export default function SectionBlock({ id, label, title, children, className = "" }) {
	return (
		<section id={id} className={`section ${className}`}>
			<div className="section__divider" />
			<div className="section__header">
				{label && <p className="section__label rv">{label}</p>}
				{title && (
					<h2 className="section__title rv" style={{ transitionDelay: ".07s" }}>
						{title}
					</h2>
				)}
			</div>
			<div className="section__body">{children}</div>
		</section>
	);
}

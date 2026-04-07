import SectionBlock from "../../components/ui/SectionBlock";
import { contact } from "../../data";
import { useReveal } from "../../hooks/useReveal";
import "./Contact.scss";

export default function Contact() {
	useReveal();
	return (
		<SectionBlock id="contact" label="Contact" title={contact.heading}>
			<p className="contact__body rv" style={{ transitionDelay: ".11s" }}>
				{contact.body}
			</p>
			<div className="contact__links rv" style={{ transitionDelay: ".17s" }}>
				{contact.links.map(({ key, value, href }) => (
					<a key={key} href={href} className="clink" target="_blank" rel="noreferrer">
						<div className="clink__left">
							<span className="clink__key">{key}</span>
							<span className="clink__value">{value}</span>
						</div>
						<span className="clink__arr">↗</span>
					</a>
				))}
			</div>
		</SectionBlock>
	);
}

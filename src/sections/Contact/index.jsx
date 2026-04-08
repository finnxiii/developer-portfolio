import SectionBlock, { RvWrap } from "../../components/ui/SectionBlock";
import { contact } from "../../data";
import { useReveal } from "../../hooks/useReveal";
import "./Contact.scss";

export default function Contact() {
	useReveal();
	return (
		<SectionBlock id="contact" label="Contact">
			<RvWrap delay=".08s">
				<p className="contact__body">{contact.body}</p>
			</RvWrap>

			<RvWrap delay=".18s">
				<div className="contact__links">
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
			</RvWrap>
		</SectionBlock>
	);
}

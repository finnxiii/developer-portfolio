import { Link } from "react-router-dom";
import "./FieldNoteCard.scss";

export default function FieldNoteCard({ note, headingAs: H = "h3" }) {
	const { slug, title, date, topic, readTime } = note;

	return (
		<article className="field-note-card">
			<div className="field-note-card__meta">
				{date && <time className="field-note-card__date" dateTime={date}>{date}</time>}
				{topic && <span className="field-note-card__topic">{topic}</span>}
				{readTime && <span className="field-note-card__read">{readTime} read</span>}
			</div>
			<H className="field-note-card__title">
				<Link to={`/notes/${slug}`} className="field-note-card__link">
					{title}
				</Link>
			</H>
		</article>
	);
}

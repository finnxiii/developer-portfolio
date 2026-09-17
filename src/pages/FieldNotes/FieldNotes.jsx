import { useRef } from "react";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import FieldNoteCard from "../../components/editorial/FieldNoteCard/FieldNoteCard";
import Rule from "../../components/ui/Rule/Rule";
import SEOHead from "../../components/ui/SEOHead/SEOHead";
import "./FieldNotes.scss";

export default function FieldNotes() {
	const containerRef = useRef(null);
	useScrollReveal(containerRef);

	const { data } = usePortfolioData();
	const { fieldNotes = [] } = data;

	return (
		<div className="field-notes" ref={containerRef}>
			<SEOHead
				title="Field Notes"
				description="Technical field notes, build logs, and engineering reflections — specific, honest, and short."
			/>
			<div className="container">
				<header className="field-notes__header rv">
					<span className="field-notes__eyebrow label-text">Field Notes</span>
					<h1 className="field-notes__title">Working notes from the build.</h1>
					<p className="field-notes__deck">
						Build logs, debugging postmortems, design decisions, and learning reflections.
						Short, honest, and specific.
					</p>
				</header>

				<Rule />

				<div className="field-notes__list">
					{fieldNotes.length === 0 ? (
						<p className="field-notes__empty">No notes published yet.</p>
					) : (
						fieldNotes.map((note, i) => (
							<div key={note.slug} className="rv" data-reveal-delay={i * 0.07}>
								<FieldNoteCard note={note} headingAs="h2" />
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}

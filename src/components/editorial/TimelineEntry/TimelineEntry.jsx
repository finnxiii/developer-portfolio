import "./TimelineEntry.scss";

export default function TimelineEntry({ dateRange, org, role, bullets = [], current }) {
	return (
		<div className="timeline-entry">
			<div className="timeline-entry__head">
				<span className="timeline-entry__date">{dateRange}</span>
				{current && (
					<span className="timeline-entry__now label-text">Current</span>
				)}
			</div>
			<div className="timeline-entry__body">
				<p className="timeline-entry__org">{org}</p>
				<p className="timeline-entry__role">{role}</p>
				{bullets.length > 0 && (
					<ul className="timeline-entry__bullets" role="list">
						{bullets.map((bullet, i) => (
							<li key={i}>{bullet}</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}

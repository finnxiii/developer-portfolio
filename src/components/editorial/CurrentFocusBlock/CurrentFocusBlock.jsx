import "./CurrentFocusBlock.scss";

export default function CurrentFocusBlock({ focus }) {
	const { date, building, learning, exploring } = focus;

	return (
		<aside className="current-focus">
			<div className="current-focus__header">
				<span className="current-focus__label label-text">Currently</span>
				{date && <span className="current-focus__date">{date}</span>}
			</div>
			<dl className="current-focus__list">
				{building && (
					<div className="current-focus__item">
						<dt>Building</dt>
						<dd>{building}</dd>
					</div>
				)}
				{learning && (
					<div className="current-focus__item">
						<dt>Learning</dt>
						<dd>{learning}</dd>
					</div>
				)}
				{exploring && (
					<div className="current-focus__item">
						<dt>Exploring</dt>
						<dd>{exploring}</dd>
					</div>
				)}
			</dl>
		</aside>
	);
}

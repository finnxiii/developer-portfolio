import "./PageHeader.scss";

export default function PageHeader({ kicker, title, deck, meta }) {
	return (
		<header className="page-header rv">
			{kicker && (
				<p className="page-header__kicker label-text">{kicker}</p>
			)}
			<h1 className="page-header__title">{title}</h1>
			{(deck || meta) && (
				<div className="page-header__foot">
					{deck && <p className="page-header__deck">{deck}</p>}
					{meta && <span className="page-header__meta">{meta}</span>}
				</div>
			)}
		</header>
	);
}

import { Link } from "react-router-dom";
import "./Breadcrumb.scss";

// items: [{ label, to }] — last item has no `to` (current page)
export default function Breadcrumb({ items }) {
	return (
		<nav className="breadcrumb" aria-label="Breadcrumb">
			<ol className="breadcrumb__list">
				{items.map((item, i) => {
					const isLast = i === items.length - 1;
					return (
						<li key={i} className="breadcrumb__item">
							{isLast || !item.to ? (
								<span className="breadcrumb__current" aria-current="page">
									{item.label}
								</span>
							) : (
								<Link to={item.to} className="breadcrumb__link">
									{item.label}
								</Link>
							)}
							{!isLast && (
								<span className="breadcrumb__sep" aria-hidden="true">
									/
								</span>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}

import { Link } from "react-router-dom";
import "./Masthead.scss";

export default function Masthead() {
	return (
		<header className="masthead" role="banner">
			<div className="masthead__inner container">
				<Link to="/" className="masthead__wordmark" aria-label="FINNXIII.DEV — Home">
					FINNXIII.DEV
				</Link>
				<p className="masthead__descriptor label-text">The Engineering Edition</p>
			</div>
		</header>
	);
}

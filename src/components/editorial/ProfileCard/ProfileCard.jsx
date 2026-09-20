import { Link } from "react-router-dom";
import "./ProfileCard.scss";

export default function ProfileCard({ profile }) {
	const { name, role, university, bio, interests = [] } = profile;

	return (
		<aside className="profile-card">
			<p className="profile-card__eyebrow label-text">Meet the engineer</p>
			<p className="profile-card__name">{name}</p>
			<p className="profile-card__role">{role}</p>
			{university && (
				<p className="profile-card__meta">{university}</p>
			)}
			<p className="profile-card__divider" aria-hidden="true" />
			{bio && <p className="profile-card__bio">{bio}</p>}
			{interests.length > 0 && (
				<ul className="profile-card__interests" aria-label="Areas of interest" role="list">
					{interests.map((interest) => (
						<li key={interest}>{interest}</li>
					))}
				</ul>
			)}
			<Link to="/about" className="profile-card__link">
				Read full profile <span className="arrow">→</span>
			</Link>
		</aside>
	);
}

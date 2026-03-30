import { stars } from "../../data/heroSceneData";

function Stars() {
	return (
		<div className="absolute inset-0">
			{stars.map((star, index) => (
				<span key={index} className={`absolute ${star.className}`} style={star.style} />
			))}
		</div>
	);
}

export default Stars;

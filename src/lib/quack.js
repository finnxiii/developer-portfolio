export async function askQuack(question) {
	const q = question.toLowerCase();

	if (q.includes("vigil")) {
		return "Vigil is Finn's self-hosted, privacy-first web analytics and security monitor: live metrics, bot scores, and a 3D map of where requests come from.";
	}
	if (q.includes("meeting") || q.includes("amrc")) {
		return "The Meeting Cost Calculator is a web app his team of six built for an AMRC client. The CSV import shows a diff before it writes anything.";
	}
	if (q.includes("sorts") || q.includes("waste")) {
		return "SORTS is an AI waste sorter built in six hours at a hackathon: camera, vision model and servo in one loop. It won Most Adventurous Hack.";
	}
	if (
		q.includes("placement") ||
		q.includes("hire") ||
		q.includes("cv") ||
		q.includes("job")
	) {
		return "He's looking for a 12-month industrial placement. I'd hire him, but I'm a duck.";
	}
	return "I'm still learning! Soon I'll answer from Finn's case studies. Try asking about Vigil, SORTS, or placements.";
}

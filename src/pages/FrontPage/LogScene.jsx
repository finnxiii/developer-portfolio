export default function LogScene() {
	return (
		<div className="log-scene">
			<div className="log-scene__lanes" aria-hidden="true">
				<span className="log-scene__lane log-scene__lane--degree" />
				<span className="log-scene__lane log-scene__lane--projects" />
				<span className="log-scene__lane log-scene__lane--work" />
			</div>
		</div>
	);
}

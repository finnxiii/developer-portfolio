export default function TestsScene() {
	return (
		<div className="tests-scene">
			<pre className="tests-scene__ticks" aria-hidden="true">
				{Array.from({ length: 80 }, (_, i) =>
					"✓ " + ["passed", "green", "ok", "passed"][i % 4]
				).join("\n")}
			</pre>
		</div>
	);
}

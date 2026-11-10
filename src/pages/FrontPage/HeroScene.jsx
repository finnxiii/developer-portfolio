export default function HeroScene() {
	return (
		<div className="hero-scene">
			<pre className="hero-scene__gutter" aria-hidden="true">
				{Array.from({ length: 60 }, (_, i) => i + 1).join("\n")}
			</pre>
		</div>
	);
}

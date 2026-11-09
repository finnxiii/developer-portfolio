import { useSideArtFit } from "../../hooks/useSideArtFit";

export default function WorkScene() {
	const traceFits = useSideArtFit(300);
	return (
		<div className="work-scene">
			{traceFits && (
				<pre className="work-scene__trace" aria-hidden="true">{`java.lang.Curiosity: how does this work?
    at Finn.build(Work.java:1)
    at Finn.test(Work.java:2)
    at Finn.breakIt(Work.java:3)
    at Finn.fix(Work.java:4)`}</pre>
			)}
		</div>
	);
}

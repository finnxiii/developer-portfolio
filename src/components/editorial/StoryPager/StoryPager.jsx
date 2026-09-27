import { Link } from "react-router-dom";
import "./StoryPager.scss";

export default function StoryPager({ prev, next, kind = "case study", basePath }) {
	const kindPlural = kind === "case study" ? "case studies" : `${kind}s`;

	return (
		<div className="story-pager">
			<div className="container">
				<div className="story-pager__grid">
					{/* Left cell: prev, or fallback to index */}
					<div className="story-pager__cell story-pager__cell--left">
						{prev ? (
							<>
								<span className="story-pager__label label-text">
									← Previous {kind}{prev.num ? ` · No. ${prev.num}` : ""}
								</span>
								<p className="story-pager__title">{prev.title}</p>
								<Link to={`${basePath}/${prev.slug}`} className="btn btn--outline">
									← Read the {kind}
								</Link>
							</>
						) : (
							<>
								<span className="story-pager__label label-text">← All {kindPlural}</span>
								<Link to={basePath} className="btn btn--outline">
									Back to all {kindPlural}
								</Link>
							</>
						)}
					</div>

					{/* Right cell: next, or fallback to index */}
					<div className="story-pager__cell story-pager__cell--right">
						{next ? (
							<>
								<span className="story-pager__label label-text">
									Next {kind}{next.num ? ` · No. ${next.num}` : ""} →
								</span>
								<p className="story-pager__title">{next.title}</p>
								<Link to={`${basePath}/${next.slug}`} className="btn btn--solid">
									Read the {kind} →
								</Link>
							</>
						) : (
							<>
								<span className="story-pager__label label-text">All {kindPlural} →</span>
								<Link to={basePath} className="btn btn--solid">
									Back to all {kindPlural}
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

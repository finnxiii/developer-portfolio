import "./Rule.scss";

export default function Rule({ className = "" }) {
	return <hr className={`rule ${className}`.trim()} aria-hidden="true" />;
}

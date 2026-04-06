import { useCursor } from "../../hooks/useCursor";
import "./Cursor.css";

export default function Cursor() {
	useCursor();

	return (
		<>
			<div id="cursor-dot" className="cursor-dot" />
			<div id="cursor-ring" className="cursor-ring" />
		</>
	);
}

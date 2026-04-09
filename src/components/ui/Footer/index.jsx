import "./Footer.scss";

export default function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="footer">
			<span className="footer__copy">© {year} finnxiii</span>
			<span className="footer__built">Built with React + Vite</span>
		</footer>
	);
}

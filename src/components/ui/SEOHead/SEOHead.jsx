// React 19 hoists <title>, <meta>, and <link> elements to <head> automatically.
import { useLocation } from "react-router-dom";

const AUTHOR = "Naing Htoo Lwin";
const SITE_NAME = "The Build Log";
const SITE_URL = "https://finnxiii.dev";
const DEFAULT_OG_IMAGE = "/images/og/default.png";

export default function SEOHead({ title, raw = false, description, ogImage = DEFAULT_OG_IMAGE }) {
	const { pathname } = useLocation();
	const fullTitle = raw ? title : (title ? `${title} | ${SITE_NAME}` : `${AUTHOR} | ${SITE_NAME}`);
	const canonical = `${SITE_URL}${pathname}`;
	const ogImageAbsolute = ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`;

	return (
		<>
			<title>{fullTitle}</title>
			{description && <meta name="description" content={description} />}
			<link rel="canonical" href={canonical} />

			{/* Open Graph */}
			<meta property="og:title" content={fullTitle} />
			{description && <meta property="og:description" content={description} />}
			<meta property="og:image" content={ogImageAbsolute} />
			<meta property="og:type" content="website" />
			<meta property="og:url" content={canonical} />
			<meta property="og:site_name" content="The Build Log" />

			{/* Twitter / X */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={fullTitle} />
			{description && <meta name="twitter:description" content={description} />}
			<meta name="twitter:image" content={ogImageAbsolute} />
		</>
	);
}

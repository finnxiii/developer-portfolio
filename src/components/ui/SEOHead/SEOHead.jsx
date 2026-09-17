// React 19 hoists <title> and <meta> elements to <head> automatically.
// No external library needed.

const SITE_NAME = "FINNXIII.DEV";
const DEFAULT_OG_IMAGE = "/images/og/default.png";

export default function SEOHead({ title, description, ogImage = DEFAULT_OG_IMAGE }) {
	const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — The Engineering Edition`;

	return (
		<>
			<title>{fullTitle}</title>
			{description && <meta name="description" content={description} />}

			{/* Open Graph */}
			<meta property="og:title" content={fullTitle} />
			{description && <meta property="og:description" content={description} />}
			<meta property="og:image" content={ogImage} />
			<meta property="og:type" content="website" />
			<meta property="og:site_name" content={SITE_NAME} />

			{/* Twitter / X */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={fullTitle} />
			{description && <meta name="twitter:description" content={description} />}
			<meta name="twitter:image" content={ogImage} />
		</>
	);
}

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { resolve } from "path";

function sitemapPlugin() {
	return {
		name: "vite-plugin-sitemap",
		closeBundle() {
			const SITE_URL = "https://finnxiii.dev";
			const content = JSON.parse(
				readFileSync(resolve("src/content/fallback.json"), "utf-8")
			);
			const staticRoutes = [
				{ path: "/", priority: "1.0", changefreq: "weekly" },
				{ path: "/work", priority: "0.9", changefreq: "monthly" },
				{ path: "/about", priority: "0.8", changefreq: "monthly" },
				{ path: "/notes", priority: "0.8", changefreq: "weekly" },
				{ path: "/now", priority: "0.7", changefreq: "monthly" },
			];
			const projectRoutes = (content.projects ?? []).map((p) => ({
				path: `/work/${p.slug}`,
				priority: "0.7",
				changefreq: "monthly",
			}));
			const noteRoutes = (content.fieldNotes ?? []).map((n) => ({
				path: `/notes/${n.slug}`,
				priority: "0.6",
				changefreq: "never",
			}));
			const all = [...staticRoutes, ...projectRoutes, ...noteRoutes];
			const xml = [
				'<?xml version="1.0" encoding="UTF-8"?>',
				'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
				...all.map(
					({ path, priority, changefreq }) =>
						`  <url>\n    <loc>${SITE_URL}${path}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
				),
				"</urlset>",
			].join("\n");
			writeFileSync(resolve("dist/sitemap.xml"), xml, "utf-8");
		},
	};
}

function fontPreloadPlugin() {
	return {
		name: "vite-plugin-font-preload",
		closeBundle() {
			// Find hashed font files for the two critical weights
			const assetsDir = resolve("dist/assets");
			let files;
			try { files = readdirSync(assetsDir); } catch { return; }

			// Prioritise Fraunces variable (display) and IBM Plex Sans 400 (body)
			const patterns = [
				/^fraunces-latin-wght-normal-.+\.woff2$/,
				/^ibm-plex-sans-latin-400-normal-.+\.woff2$/,
			];
			const preloads = patterns
				.map((re) => files.find((f) => re.test(f)))
				.filter(Boolean)
				.map((f) => `  <link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin>`)
				.join("\n");

			if (!preloads) return;

			const htmlPath = resolve("dist/index.html");
			let html;
			try { html = readFileSync(htmlPath, "utf-8"); } catch { return; }
			if (html.includes("font/woff2")) return; // already injected
			html = html.replace("</head>", `${preloads}\n</head>`);
			writeFileSync(htmlPath, html, "utf-8");
		},
	};
}

export default defineConfig({
	plugins: [react(), sitemapPlugin(), fontPreloadPlugin()],
});

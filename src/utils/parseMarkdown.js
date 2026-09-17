// Lightweight Markdown parser for field note bodies.
// Supports: ## h2, ### h3, **bold**, *italic*, `code`, - lists, paragraphs.

function escapeHtml(str) {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

function inline(text) {
	return escapeHtml(text)
		.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
		.replace(/\*(.+?)\*/g, "<em>$1</em>")
		.replace(/`(.+?)`/g, "<code>$1</code>");
}

export function parseMarkdown(text) {
	if (!text) return "";

	// Split into blocks on blank lines
	const blocks = text.split(/\n\n+/);

	return blocks
		.map((block) => {
			const trimmed = block.trim();
			if (!trimmed) return "";

			if (trimmed.startsWith("### ")) {
				return `<h3>${inline(trimmed.slice(4))}</h3>`;
			}
			if (trimmed.startsWith("## ")) {
				return `<h2>${inline(trimmed.slice(3))}</h2>`;
			}

			const lines = trimmed.split("\n");
			if (lines.every((l) => l.startsWith("- "))) {
				const items = lines
					.map((l) => `<li>${inline(l.slice(2))}</li>`)
					.join("");
				return `<ul>${items}</ul>`;
			}

			return `<p>${inline(trimmed.replace(/\n/g, " "))}</p>`;
		})
		.join("");
}

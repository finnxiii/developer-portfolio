// Lightweight Markdown parsers for field note bodies.
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

// Variant that adds Roman-numeral section heads and returns {html, headings} for TOC use.
const ROMAN_NOTE = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

export function parseNoteBody(text) {
	if (!text) return { html: "", headings: [] };

	const headings = [];
	let headingIdx = 0;
	let isFirstPara = true;

	const blocks = text.split(/\n\n+/);

	const html = blocks
		.map((block) => {
			const trimmed = block.trim();
			if (!trimmed) return "";

			if (trimmed.startsWith("### ")) {
				return `<h3>${inline(trimmed.slice(4))}</h3>`;
			}
			if (trimmed.startsWith("## ")) {
				const headingText = trimmed.slice(3).trim();
				const id =
					"fn-" +
					headingText
						.toLowerCase()
						.replace(/[^a-z0-9]+/g, "-")
						.replace(/^-+|-+$/g, "");
				const roman = ROMAN_NOTE[headingIdx] ?? String(headingIdx + 1);
				headings.push({ id, text: headingText, roman });
				headingIdx++;
				return `<div class="fn-section-head" id="${escapeHtml(id)}"><span class="fn-section-roman" aria-hidden="true">${roman}.</span><h2 class="fn-section-title">${inline(headingText)}</h2></div>`;
			}

			const lines = trimmed.split("\n");
			if (lines.every((l) => l.startsWith("- "))) {
				const items = lines
					.map((l) => `<li>${inline(l.slice(2))}</li>`)
					.join("");
				return `<ul>${items}</ul>`;
			}

			const first = isFirstPara;
			if (first) isFirstPara = false;
			return `<p${first ? ' class="drop-cap"' : ""}>${inline(trimmed.replace(/\n/g, " "))}</p>`;
		})
		.join("");

	return { html, headings };
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

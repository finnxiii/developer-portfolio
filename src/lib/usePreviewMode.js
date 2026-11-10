const SS_KEY = "pvw_draft";

export function usePreviewMode() {
	let isPreview = false;
	try {
		if (typeof window !== "undefined") {
			if (new URLSearchParams(window.location.search).get("preview") === "draft") {
				try { sessionStorage.setItem(SS_KEY, "1"); } catch { /* ignore */ }
				isPreview = true;
			} else {
				try { isPreview = sessionStorage.getItem(SS_KEY) === "1"; } catch { /* ignore */ }
			}
		}
	} catch { /* ignore */ }

	const exitPreview = () => {
		try { sessionStorage.removeItem(SS_KEY); } catch { /* ignore */ }
		const url = new URL(window.location.href);
		url.searchParams.delete("preview");
		window.location.replace(url.toString());
	};

	return { isPreview, exitPreview };
}

import { useState, useEffect } from "react";

function getIdbStagedCv() {
	return new Promise((resolve) => {
		try {
			const req = indexedDB.open("adm_cv", 1);
			req.onerror = () => resolve(null);
			req.onsuccess = () => {
				const db = req.result;
				if (!db.objectStoreNames.contains("staged")) {
					db.close();
					resolve(null);
					return;
				}
				const getReq = db
					.transaction("staged", "readonly")
					.objectStore("staged")
					.get("current");
				getReq.onsuccess = () => { db.close(); resolve(getReq.result ?? null); };
				getReq.onerror = () => { db.close(); resolve(null); };
			};
		} catch { resolve(null); }
	});
}

export function useStagedCvUrl(enabled) {
	const [url, setUrl] = useState(null);

	useEffect(() => {
		if (!enabled) return;
		let blobUrl = null;
		getIdbStagedCv().then((cv) => {
			if (!cv?.blob) return;
			blobUrl = URL.createObjectURL(cv.blob);
			setUrl(blobUrl);
		});
		return () => { if (blobUrl) URL.revokeObjectURL(blobUrl); };
	}, [enabled]);

	return url;
}

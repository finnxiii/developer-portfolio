import { useState, useEffect, useCallback } from "react";

const IDB_NAME = "adm_cv";
const IDB_STORE = "staged";
const IDB_KEY = "current";

function openIDB() {
	return new Promise((res, rej) => {
		const req = indexedDB.open(IDB_NAME, 1);
		req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
		req.onsuccess = () => res(req.result);
		req.onerror = () => rej(req.error);
	});
}

async function idbGet() {
	try {
		const db = await openIDB();
		return new Promise((res) => {
			const req = db.transaction(IDB_STORE).objectStore(IDB_STORE).get(IDB_KEY);
			req.onsuccess = () => res(req.result ?? null);
			req.onerror = () => res(null);
		});
	} catch {
		return null;
	}
}

async function idbSet(value) {
	const db = await openIDB();
	return new Promise((res, rej) => {
		const tx = db.transaction(IDB_STORE, "readwrite");
		tx.objectStore(IDB_STORE).put(value, IDB_KEY);
		tx.oncomplete = () => res();
		tx.onerror = () => rej(tx.error);
	});
}

async function idbClear() {
	try {
		const db = await openIDB();
		return new Promise((res) => {
			const tx = db.transaction(IDB_STORE, "readwrite");
			tx.objectStore(IDB_STORE).delete(IDB_KEY);
			tx.oncomplete = () => res();
			tx.onerror = () => res();
		});
	} catch {
		/* ignore */
	}
}

export function useCvStaged() {
	const [cvStaged, setCvStaged] = useState(null);
	const [cvLoading, setCvLoading] = useState(true);

	useEffect(() => {
		idbGet().then((val) => {
			setCvStaged(val);
			setCvLoading(false);
		});
	}, []);

	const stageCv = useCallback(async ({ blob, filename, size, pages, note }) => {
		const record = { blob, filename, size, pages, note, stagedAt: new Date().toISOString() };
		await idbSet(record);
		setCvStaged(record);
	}, []);

	const unstageCv = useCallback(async () => {
		await idbClear();
		setCvStaged(null);
	}, []);

	return { cvStaged, stageCv, unstageCv, cvLoading };
}

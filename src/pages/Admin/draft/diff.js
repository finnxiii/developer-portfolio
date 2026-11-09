function truncate(val, maxLen = 120) {
	if (val === null || val === undefined) return String(val);
	const s = typeof val === "object" ? JSON.stringify(val) : String(val);
	return s.length > maxLen ? s.slice(0, maxLen) + "…" : s;
}

function matchKey(item) {
	return item?.slug ?? item?.id ?? null;
}

function diffValue(aVal, bVal, path, results) {
	if (JSON.stringify(aVal) === JSON.stringify(bVal)) return;

	if (Array.isArray(aVal) && Array.isArray(bVal)) {
		diffArrays(aVal, bVal, path, results);
		return;
	}

	if (
		aVal !== null && bVal !== null &&
		typeof aVal === "object" && !Array.isArray(aVal) &&
		typeof bVal === "object" && !Array.isArray(bVal)
	) {
		const allKeys = new Set([...Object.keys(aVal), ...Object.keys(bVal)]);
		for (const k of allKeys) {
			diffValue(aVal[k], bVal[k], `${path} › ${k}`, results);
		}
		return;
	}

	results.push({ path, before: aVal, after: bVal });
}

function diffArrays(aArr, bArr, path, results) {
	const hasKey = [...aArr, ...bArr].some(
		(item) => typeof item === "object" && item !== null && matchKey(item) !== null
	);

	if (hasKey) {
		const aMap = new Map(aArr.map((item) => [matchKey(item) ?? JSON.stringify(item), item]));
		const bMap = new Map(bArr.map((item) => [matchKey(item) ?? JSON.stringify(item), item]));
		for (const [k, bItem] of bMap) {
			const aItem = aMap.get(k);
			if (aItem === undefined) {
				results.push({ path: `${path} › ${k} (added)`, before: null, after: bItem });
			} else {
				diffValue(aItem, bItem, `${path} › ${k}`, results);
			}
		}
		for (const [k, aItem] of aMap) {
			if (!bMap.has(k)) {
				results.push({ path: `${path} › ${k} (removed)`, before: aItem, after: null });
			}
		}
	} else {
		const len = Math.max(aArr.length, bArr.length);
		for (let i = 0; i < len; i++) {
			diffValue(aArr[i], bArr[i], `${path}[${i}]`, results);
		}
	}
}

export function computeSectionDiff(baseSection, draftSection, sectionKey) {
	const results = [];
	diffValue(baseSection, draftSection, sectionKey, results);
	return results.map((r) => ({
		path: r.path,
		before: truncate(r.before),
		after: truncate(r.after),
	}));
}

export function computeAllStagedDiff(base, draft, stagedSections) {
	if (!base || !draft || !stagedSections?.size) return [];
	const results = [];
	for (const key of stagedSections) {
		diffValue(base[key], draft[key], key, results);
	}
	return results.map((r) => ({
		path: r.path,
		before: truncate(r.before),
		after: truncate(r.after),
	}));
}

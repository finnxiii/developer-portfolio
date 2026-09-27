import { useState, useEffect } from "react";
import fallback from "../content/fallback.json";

const USE_KV = import.meta.env.VITE_USE_KV === "true";

export function usePortfolioData() {
	const [data, setData] = useState(fallback);
	const [loading, setLoading] = useState(USE_KV);

	useEffect(() => {
		if (!USE_KV) return;

		fetch("/api/content")
			.then((res) => {
				if (!res.ok) throw new Error("API unavailable");
				return res.json();
			})
			.then(setData)
			.catch(() => setData(fallback))
			.finally(() => setLoading(false));
	}, []);

	return { data, loading };
}

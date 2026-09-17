import { useState, useEffect } from "react";
import fallback from "../content/fallback.json";

export function usePortfolioData() {
	// Seed with fallback so pages always have something to render on first pass.
	// The effect overwrites with live KV data when the API responds.
	const [data, setData] = useState(fallback);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
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

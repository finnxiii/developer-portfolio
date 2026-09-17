import { useState, useCallback } from "react";

const TOKEN_KEY = "admin_token";

export function useAdmin() {
	const [token, setToken] = useState(() => {
		try { return localStorage.getItem(TOKEN_KEY); }
		catch { return null; }
	});

	const isAuthenticated = Boolean(token);

	const login = useCallback((newToken) => {
		try { localStorage.setItem(TOKEN_KEY, newToken); } catch {}
		setToken(newToken);
	}, []);

	const logout = useCallback(() => {
		try { localStorage.removeItem(TOKEN_KEY); } catch {}
		setToken(null);
	}, []);

	const authHeaders = token
		? { Authorization: `Bearer ${token}` }
		: {};

	return { token, isAuthenticated, login, logout, authHeaders };
}

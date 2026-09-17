import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../hooks/useAdmin";
import "./Admin.scss";

export default function AdminLogin() {
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const { login } = useAdmin();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const res = await fetch("/api/admin/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password }),
			});

			if (!res.ok) {
				setError("Invalid password.");
				return;
			}

			const { token } = await res.json();
			login(token);
			navigate("/admin/dashboard");
		} catch {
			setError("Could not connect to server.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="adm-login">
			<div className="adm-login__card">
				<h1 className="adm-login__title">Admin Login</h1>
				<p className="adm-login__subtitle">FINNXIII.DEV — Content Portal</p>
				<form className="adm-login__form" onSubmit={handleSubmit}>
					<label className="adm-label" htmlFor="password">Password</label>
					<input
						id="password"
						type="password"
						className="adm-input"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						autoComplete="current-password"
					/>
					{error && <p className="adm-error">{error}</p>}
					<button type="submit" className="adm-btn adm-btn--primary" disabled={loading}>
						{loading ? "Signing in…" : "Sign in"}
					</button>
				</form>
			</div>
		</div>
	);
}

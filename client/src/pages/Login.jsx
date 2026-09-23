import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(form.email, form.password);
      navigate(location.state?.from?.pathname || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to sign in");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <div className="eyebrow">PERSONAL FINANCE</div>
        <h1>Welcome back</h1>
        <p className="muted">Sign in to manage your expenses.</p>
        {error && <div className="alert">{error}</div>}
        <label>Email<input type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} required /></label>
        <label>Password<input type="password" value={form.password} onChange={e => setForm({...form,password:e.target.value})} required /></label>
        <button className="primary" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
        <p className="switch">Don't have an account? <Link to="/register">Create one</Link></p>
      </form>
    </main>
  );
}

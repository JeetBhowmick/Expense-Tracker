import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create account");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <div className="eyebrow">PERSONAL FINANCE</div>
        <h1>Create account</h1>
        <p className="muted">Start tracking where your money goes.</p>
        {error && <div className="alert">{error}</div>}
        <label>Name<input value={form.name} onChange={e => setForm({...form,name:e.target.value})} required /></label>
        <label>Email<input type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} required /></label>
        <label>Password<input type="password" minLength="6" value={form.password} onChange={e => setForm({...form,password:e.target.value})} required /></label>
        <button className="primary" disabled={busy}>{busy ? "Creating..." : "Create account"}</button>
        <p className="switch">Already registered? <Link to="/login">Sign in</Link></p>
      </form>
    </main>
  );
}

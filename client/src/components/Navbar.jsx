import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <Link className="brand" to="/">Expense Tracker</Link>
      <nav>
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/expenses">Expenses</NavLink>
        <button className="link-button" onClick={handleLogout}>Logout</button>
      </nav>
      <span className="user-name">{user?.name}</span>
    </header>
  );
}

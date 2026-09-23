import { useEffect, useState } from "react";
import api from "../api";

const money = value => `₹${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

export default function Dashboard() {
  const [summary, setSummary] = useState({ total: 0, monthly: 0, count: 0, byCategory: {} });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/expenses/summary"), api.get("/expenses")])
      .then(([s, e]) => {
        setSummary(s.data);
        setRecent(e.data.slice(0, 5));
      });
  }, []);

  const categories = Object.entries(summary.byCategory).sort((a,b) => b[1] - a[1]);
  const max = categories[0]?.[1] || 1;

  return (
    <main className="container">
      <div className="page-heading"><div><div className="eyebrow">OVERVIEW</div><h1>Dashboard</h1></div></div>
      <section className="stats">
        <article><span>Total spent</span><strong>{money(summary.total)}</strong></article>
        <article><span>This month</span><strong>{money(summary.monthly)}</strong></article>
        <article><span>Transactions</span><strong>{summary.count}</strong></article>
      </section>
      <section className="grid-two">
        <article className="card">
          <h2>Spending by category</h2>
          {categories.length === 0 ? <p className="muted">No expenses yet.</p> : categories.map(([name, value]) => (
            <div className="bar-row" key={name}><div><span>{name}</span><b>{money(value)}</b></div><div className="bar-track"><div className="bar" style={{width:`${(value/max)*100}%`}} /></div></div>
          ))}
        </article>
        <article className="card">
          <h2>Recent expenses</h2>
          {recent.length === 0 ? <p className="muted">Add your first expense from the Expenses page.</p> : recent.map(item => (
            <div className="recent" key={item._id}><div><b>{item.title}</b><small>{item.category} · {new Date(item.date).toLocaleDateString()}</small></div><strong>{money(item.amount)}</strong></div>
          ))}
        </article>
      </section>
    </main>
  );
}

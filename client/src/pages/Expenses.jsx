import { useEffect, useState } from "react";
import api from "../api";

const categories = ["Food","Transport","Shopping","Bills","Health","Education","Other"];
const initial = { title:"", amount:"", category:"Food", date:new Date().toISOString().slice(0,10), notes:"" };
const money = value => `₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState(initial);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const { data } = await api.get("/expenses", { params: { category: filter, search } });
    setExpenses(data);
  }

  useEffect(() => { load().catch(() => setError("Could not load expenses")); }, [filter]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      if (editingId) await api.put(`/expenses/${editingId}`, form);
      else await api.post("/expenses", form);
      setForm(initial);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save expense");
    }
  }

  function edit(item) {
    setEditingId(item._id);
    setForm({
      title: item.title,
      amount: item.amount,
      category: item.category,
      date: new Date(item.date).toISOString().slice(0,10),
      notes: item.notes || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id) {
    if (!window.confirm("Delete this expense?")) return;
    await api.delete(`/expenses/${id}`);
    load();
  }

  return (
    <main className="container">
      <div className="page-heading"><div><div className="eyebrow">TRANSACTIONS</div><h1>Expenses</h1></div></div>
      <section className="card form-card">
        <h2>{editingId ? "Edit expense" : "Add expense"}</h2>
        {error && <div className="alert">{error}</div>}
        <form className="expense-form" onSubmit={submit}>
          <label>Title<input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Lunch" required /></label>
          <label>Amount<input type="number" min="0" step="0.01" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} placeholder="0.00" required /></label>
          <label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{categories.map(c=><option key={c}>{c}</option>)}</select></label>
          <label>Date<input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required /></label>
          <label className="wide">Notes<input value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Optional note" /></label>
          <div className="actions wide"><button className="primary">{editingId ? "Update expense" : "Add expense"}</button>{editingId && <button type="button" onClick={()=>{setEditingId(null);setForm(initial)}}>Cancel</button>}</div>
        </form>
      </section>
      <section className="card">
        <div className="toolbar"><h2>All expenses</h2><div><input placeholder="Search title..." value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&load()} /><select value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option>{categories.map(c=><option key={c}>{c}</option>)}</select></div></div>
        {expenses.length===0 ? <p className="muted">No matching expenses.</p> : <div className="table-wrap"><table><thead><tr><th>Title</th><th>Category</th><th>Date</th><th>Amount</th><th></th></tr></thead><tbody>{expenses.map(item=><tr key={item._id}><td><b>{item.title}</b>{item.notes&&<small>{item.notes}</small>}</td><td>{item.category}</td><td>{new Date(item.date).toLocaleDateString()}</td><td><b>{money(item.amount)}</b></td><td className="row-actions"><button onClick={()=>edit(item)}>Edit</button><button onClick={()=>remove(item._id)}>Delete</button></td></tr>)}</tbody></table></div>}
      </section>
    </main>
  );
}

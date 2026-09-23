const mongoose = require("mongoose");
const Expense = require("../models/Expense");

async function getExpenses(req, res) {
  try {
    const { category, search } = req.query;
    const filter = { user: req.user.id };

    if (category && category !== "All") filter.category = category;
    if (search) filter.title = { $regex: search, $options: "i" };

    const expenses = await Expense.find(filter).sort({ date: -1, createdAt: -1 });
    res.json(expenses);
  } catch {
    res.status(500).json({ message: "Could not fetch expenses" });
  }
}

async function createExpense(req, res) {
  try {
    const { title, amount, category, date, notes } = req.body;
    if (!title || amount === undefined || !date) {
      return res.status(400).json({ message: "Title, amount and date are required" });
    }

    const expense = await Expense.create({
      user: req.user.id,
      title,
      amount,
      category,
      date,
      notes
    });

    res.status(201).json(expense);
  } catch {
    res.status(400).json({ message: "Invalid expense data" });
  }
}

async function updateExpense(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid expense id" });
    }

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch {
    res.status(400).json({ message: "Could not update expense" });
  }
}

async function deleteExpense(req, res) {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted" });
  } catch {
    res.status(500).json({ message: "Could not delete expense" });
  }
}

async function summary(req, res) {
  try {
    const expenses = await Expense.find({ user: req.user.id }).lean();
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const total = expenses.reduce((sum, item) => sum + item.amount, 0);
    const monthly = expenses
      .filter(item => new Date(item.date) >= monthStart)
      .reduce((sum, item) => sum + item.amount, 0);

    const byCategory = expenses.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {});

    res.json({ total, monthly, count: expenses.length, byCategory });
  } catch {
    res.status(500).json({ message: "Could not calculate summary" });
  }
}

module.exports = { getExpenses, createExpense, updateExpense, deleteExpense, summary };

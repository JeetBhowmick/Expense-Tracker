const express = require("express");
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  summary
} = require("../controllers/expenseController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);
router.get("/", getExpenses);
router.get("/summary", summary);
router.post("/", createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;

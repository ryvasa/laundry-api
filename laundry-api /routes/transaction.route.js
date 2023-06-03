const {
  addTransaction,
  findAllTransactions,
  findOneTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controller/transaction.controller");
const { verifyToken } = require("../middleware/verifyToken");

const router = require("express").Router();

router.post("/transactions", verifyToken, addTransaction);
router.get("/transactions", verifyToken, findAllTransactions);
router.get("/transactions/:id", verifyToken, findOneTransaction);
router.put("/transactions/:id", verifyToken, updateTransaction);
router.delete("/transactions/:id", verifyToken, deleteTransaction);

module.exports = router;

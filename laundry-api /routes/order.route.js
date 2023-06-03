const {
  addOrder,
  findAllOrders,
  findOneOrder,
  findAllOrdersByUserId,
  updateOrder,
  deleteOrder,
  updateStatusOrder,
} = require("../controller/order.controller");
const { verifyToken } = require("../middleware/verifyToken");

const router = require("express").Router();

router.post("/orders", verifyToken, addOrder);
router.get("/orders", verifyToken, findAllOrders);
router.get("/orders/:id", verifyToken, findOneOrder);
router.get("/ordersuser", verifyToken, findAllOrdersByUserId);
router.put("/orders/:id", verifyToken, updateOrder);
router.put("/orders/:id/status", verifyToken, updateStatusOrder);
router.delete("/orders/:id", verifyToken, deleteOrder);

module.exports = router;

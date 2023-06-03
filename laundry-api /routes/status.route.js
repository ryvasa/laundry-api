const {
  addStatus,
  findAllStatus,
  findOneStatus,
  updateStatus,
  deleteStatus,
} = require("../controller/status.controller");
const { verifyToken } = require("../middleware/verifyToken");

const router = require("express").Router();

router.post("/status", verifyToken, addStatus);
router.get("/status", verifyToken, findAllStatus);
router.get("/status/:id", verifyToken, findOneStatus);
router.put("/status/:id", verifyToken, updateStatus);
router.delete("/status/:id", verifyToken, deleteStatus);

module.exports = router;

const {
  findAllUsers,
  findOneUser,
  updateUser,
  addUser,
  deleteUser,
} = require("../controller/user.controller");
const { verifyToken } = require("../middleware/verifyToken");

const router = require("express").Router();

router.post("/users", verifyToken, addUser);
router.get("/users", verifyToken, findAllUsers);
router.get("/users/:id", verifyToken, findOneUser);
router.put("/users/:id", verifyToken, updateUser);
router.delete("/users/:id", verifyToken, deleteUser);

module.exports = router;

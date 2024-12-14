const express = require("express");
const {
  createOrder,
  getOrderById,
  getOrdersByUser,
  updateOrderStatus,
} = require("../controllers/orderController");
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.post("/", authMiddleware, createOrder);
router.get("/:id", authMiddleware, getOrderById);
router.get("/user/:userId", authMiddleware, getOrdersByUser);
router.put("/:id/status", authMiddleware, updateOrderStatus);

module.exports = router;

const express = require("express");
const {
  createPayment,
  getPaymentById,
  getPaymentsByOrder,
} = require("../controllers/paymentController");
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.post("/", authMiddleware, createPayment);
router.get("/:id", authMiddleware, getPaymentById);
router.get("/order/:orderId", authMiddleware, getPaymentsByOrder);

module.exports = router;

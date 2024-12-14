const express = require("express");
const { getMenuByRestaurant, addMenuItem, updateMenuItem, deleteMenuItem } = require("../controllers/menuController");
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.get("/:restaurantId", authMiddleware, getMenuByRestaurant);
router.post("/", authMiddleware, addMenuItem);
router.put("/:itemId", authMiddleware,  updateMenuItem);
router.delete("/:itemId", authMiddleware, deleteMenuItem);

module.exports = router;
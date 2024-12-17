const express = require("express");
const { getMenuByRestaurant, addMenuItem, updateMenuItem, deleteMenuItem } = require("../controllers/menuController");
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.get("", authMiddleware, getMenuByRestaurant);
router.post("/", authMiddleware, addMenuItem);
router.put("/:restaurant_id/item/:itemId", authMiddleware,  updateMenuItem);
router.delete("/:restaurant_id/item/:itemId", authMiddleware, deleteMenuItem);

module.exports = router;
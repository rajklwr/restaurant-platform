const express = require("express");
const {
  getRestaurantDetails,
  updateRestaurantDetails
} = require("../controllers/restaurantController");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/details", authMiddleware, getRestaurantDetails);
router.put("/details", authMiddleware, updateRestaurantDetails);
// router.get("/", authMiddleware, getAllRestaurants);
// router.get("/:id", authMiddleware, getRestaurantById);
// router.delete("/:id", authMiddleware, deleteRestaurant);

module.exports = router;

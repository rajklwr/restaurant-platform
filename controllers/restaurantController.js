const Restaurant = require("../models/Restaurant");


exports.getRestaurantDetails = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner_id: req.user.id });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json({ success: true, restaurant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateRestaurantDetails = async (req, res) => {
  try {
    const updateData = req.body;

    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      { owner_id: req.user.id },
      { $set: updateData },
      { new: true, runValidators: true } // Return the updated document and ensure validation
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({ success: true, restaurant: updatedRestaurant });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", errors: err.errors });
    }
    res.status(500).json({ message: "Server error" });
  }
};
  

// exports.getAllRestaurants = async (req, res) => {
//     try {
//         const restaurants = await Restaurant.find();
//         res.status(200).json(restaurants);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.getRestaurantById = async (req, res) => {
//     try {
//         const restaurant = await Restaurant.findById(req.params.id);
//         if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
//         res.status(200).json(restaurant);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


// exports.deleteRestaurant = async (req, res) => {
//     try {
//         const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
//         if (!deletedRestaurant) return res.status(404).json({ message: "Restaurant not found" });
//         res.status(200).json({ message: "Restaurant deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
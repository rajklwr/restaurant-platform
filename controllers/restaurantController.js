const Restaurant = require("../models/Restaurant");
const mongoose = require("mongoose");


exports.getRestaurantDetails = async (req, res) => {
    try {
      // Fetch the restaurant based on the owner's ID (using req.user._id)
    //   console.log('request :', req);
        // const objectIdUserId = new mongoose.Types.ObjectId(restaurant_id);
      const restaurant = await Restaurant.findOne({ owner_id: req.user.id });
  
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
  
      // Return restaurant details
      res.status(200).json({ success : true, restaurant});
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
        res.status(200).json(restaurant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createRestaurant = async (req, res) => {
    try {
        const newRestaurant = new Restaurant(req.body);
        await newRestaurant.save();
        res.status(201).json(newRestaurant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateRestaurant = async (req, res) => {
    try {
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRestaurant) return res.status(404).json({ message: "Restaurant not found" });
        res.status(200).json(updatedRestaurant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteRestaurant = async (req, res) => {
    try {
        const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
        if (!deletedRestaurant) return res.status(404).json({ message: "Restaurant not found" });
        res.status(200).json({ message: "Restaurant deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
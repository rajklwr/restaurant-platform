const Menu = require("../models/Menu");
const mongoose = require('mongoose');

exports.getMenuByRestaurant = async (req, res) => {
    const restaurant_id = req.user.id;
  
    try {
      // Validate restaurant_id
      if (!restaurant_id) {
        return res.status(400).json({ error: "Restaurant ID is required." });
      }
  
      // Fetch menu grouped by categories
      const menu = await Menu.aggregate([
        { $match: { restaurant_id: mongoose.Types.ObjectId(restaurant_id) } },
        {
          $group: {
            _id: "$category",
            items: { $push: "$items" },
          },
        },
        {
          $project: {
            category: "$_id",
            items: 1,
            _id: 0,
          },
        },
      ]);
  
      res.status(200).json({success : true, menu});
    } catch (error) {
      console.error("Error fetching menu:", error);
      res.status(500).json({ error: "Internal server error. Please try again later." });
    }
  };

exports.addMenuItem = async (req, res) => {
  const { category, items } = req.body;
  const restaurant_id = req.user.id;
  try {
    if (!category || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Category and at least one item are required.",
      });
    }

    const validatedItems = items.map((item) => {
      if (!item.item_id) {
        item.item_id = new mongoose.Types.ObjectId(); 
      }
      return item;
    });

    let menu = await Menu.findOne({ restaurant_id, category });

    if (menu) {
      menu.items.push(...validatedItems);
      menu.updated_at = Date.now();
    } else {
      menu = new Menu({
        restaurant_id,
        category,
        items: validatedItems,
      });
    }

    await menu.save();
    res.status(201).json({success : true, message: "Menu item(s) added successfully", menu });
  } catch (error) {
    console.error("Error adding menu items:", error);
    res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
};

exports.updateMenuItem = async (req, res) => {
    try {
        const updatedMenuItem = await Menu.findByIdAndUpdate(req.params.itemId, req.body, { new: true });
        if (!updatedMenuItem) return res.status(404).json({ message: "Menu item not found" });
        res.status(200).json(updatedMenuItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteMenuItem = async (req, res) => {
    try {
        const deletedMenuItem = await Menu.findByIdAndDelete(req.params.itemId);
        if (!deletedMenuItem) return res.status(404).json({ message: "Menu item not found" });
        res.status(200).json({ message: "Menu item deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
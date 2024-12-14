const Menu = require("../models/Menu");

exports.getMenuByRestaurant = async (req, res) => {
    try {
        const menu = await Menu.find({ restaurant: req.params.restaurantId });
        res.status(200).json(menu);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addMenuItem = async (req, res) => {
    try {
        const newMenuItem = new Menu(req.body);
        await newMenuItem.save();
        res.status(201).json(newMenuItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
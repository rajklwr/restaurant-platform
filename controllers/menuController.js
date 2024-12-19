const Menu = require("../models/Menu");
const mongoose = require("mongoose");

exports.getMenuByRestaurant = async (req, res) => {
  const restaurant_id = new mongoose.Types.ObjectId(req.user.id);

  try {
    // Validate restaurant_id
    if (!restaurant_id) {
      return res.status(400).json({ error: "Restaurant ID is required." });
    }

    // Fetch menu grouped by categories and sorted in the desired order
    const menu = await Menu.aggregate([
      { $match: { restaurant_id: restaurant_id } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$category",
          items: { $push: "$items" },
          restaurant_id: { $first: "$restaurant_id" },
        },
      },
      {
        $addFields: {
          category_priority: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", "Main Course"] }, then: 1 },
                { case: { $eq: ["$_id", "Appetizers"] }, then: 2 },
                { case: { $eq: ["$_id", "Desserts"] }, then: 3 },
                { case: { $eq: ["$_id", "Drinks"] }, then: 4 },
              ],
              default: 5, // Default priority for unexpected categories
            },
          },
        },
      },
      { $sort: { category_priority: 1 } }, // Sort by priority
      {
        $project: {
          category: "$_id",
          items: 1,
          _id: 0,
          restaurant_id: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, menu });
  } catch (error) {
    console.error("Error fetching menu:", error);
    res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
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
    res
      .status(201)
      .json({
        success: true,
        message: "Menu item(s) added successfully",
        menu,
        item: validatedItems,
      });
  } catch (error) {
    console.error("Error adding menu items:", error);
    res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    // Extract menuId, itemId, and the updated item details from the request
    const { restaurant_id, itemId } = req.params;
    const { name, description, price, image_url, availability } = req.body;

    const objectIdRestaurant_id = new mongoose.Types.ObjectId(restaurant_id);
    const objectIdItemId = new mongoose.Types.ObjectId(itemId);

    // Find the menu by menuId and the specific item by itemId, then update the item
    const updatedMenu = await Menu.findOneAndUpdate(
      { restaurant_id: objectIdRestaurant_id, "items.item_id": objectIdItemId }, // Find the menu and the item within the menu
      {
        $set: {
          "items.$.name": name,
          "items.$.description": description,
          "items.$.price": price,
          "items.$.image_url": image_url,
          "items.$.availability": availability,
        },
      },
      { new: true } // Return the updated menu after modification
    );

    // If no menu or item is found, return a 404 response
    if (!updatedMenu) {
      return res.status(404).json({ message: "Menu or menu item not found" });
    }

    // Successfully updated the menu item
    return res
      .status(200)
      .json({
        message: "Menu item updated successfully",
        menu: updatedMenu,
        success: true,
        restaurant_id: restaurant_id,
        itemId: itemId,
      });
  } catch (error) {
    // Handle server errors
    return res.status(500).json({ error: error.message });
  }
};

// Delete menu item by ID
exports.deleteMenuItem = async (req, res) => {
  try {
    const { restaurant_id, itemId } = req.params;
    console.log('params :', req.params);
    const objectIdRestaurant_id = new mongoose.Types.ObjectId(restaurant_id);
    const objectIdItemId = new mongoose.Types.ObjectId(itemId);

    // await Menu.collection.dropIndex('items.item_id_1');

    const updatedMenu = await Menu.findOneAndUpdate(
      { restaurant_id: objectIdRestaurant_id, "items.item_id": objectIdItemId }, 
      { $pull: { items: { item_id: objectIdItemId } } }, 
      { new: true } 
    );

    if (!updatedMenu) {
      return res.status(404).json({ message: "Menu or menu item not found" });
    }

    return res
      .status(200)
      .json({
        message: "Menu item deleted successfully",
        menu: updatedMenu,
        success: true,
        restaurant_id: restaurant_id,
        itemId: itemId,
      });
  } catch (error) {
    // Handle server errors
    console.log('err :', error)
    return res.status(500).json({ error: error.message });
  }
};

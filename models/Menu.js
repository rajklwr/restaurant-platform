const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuItemSchema = new Schema({
  item_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image_url: {
    type: String,
  },
  availability: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const menuSchema = new Schema({
  restaurant_id: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant', // Reference to the Restaurant model
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Appetizers', 'Main Course', 'Desserts', 'Drinks'], // Example categories, can be expanded
  },
  items: {
    type: [menuItemSchema],
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Update 'updated_at' field before saving
menuSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;

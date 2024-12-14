const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
  item_id: {
    type: Schema.Types.ObjectId,
    ref: 'Menu.items', // Reference to Menu items
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new Schema({
  restaurant_id: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant', // Reference to the Restaurant model
    required: true,
  },
  customer_details: {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  order_items: {
    type: [orderItemSchema],
    required: true,
  },
  total_price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Preparing', 'Completed'],
    required: true,
  },
  order_date: {
    type: Date,
    default: Date.now,
  },
  delivery_details: {
    address: {
      type: String,
      required: true,
    },
    delivery_time: {
      type: Date,
      required: true,
    },
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
orderSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

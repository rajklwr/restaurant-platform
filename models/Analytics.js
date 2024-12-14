const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const analyticsSchema = new Schema({
  restaurant_id: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant', // Reference to the Restaurant model
    required: true,
  },
  period: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly'], // The time period for the analytics
    required: true,
  },
  date_range: {
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
  },
  orders_count: {
    type: Number,
    default: 0,
  },
  total_revenue: {
    type: Number,
    default: 0,
  },
  new_customers: {
    type: Number,
    default: 0,
  },
  average_order_value: {
    type: Number,
    default: 0,
  },
  average_rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 0,
  },
  total_reviews: {
    type: Number,
    default: 0,
  },
  popular_items: [{
    item_id: {
      type: Schema.Types.ObjectId,
      ref: 'Menu.items',
    },
    name: {
      type: String,
    },
    orders_count: {
      type: Number,
      default: 0,
    },
  }],
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
analyticsSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;

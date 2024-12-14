const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  restaurant_id: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant', // Reference to the Restaurant model
    required: true,
  },
  customer_name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5, // Rating must be between 1 and 5
  },
  comment: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

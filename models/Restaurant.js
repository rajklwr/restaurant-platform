const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
  plan: {
    type: String,
    enum: ['Free', 'Basic', 'Standard', 'Premium'], // Added 'Free' option
    required: true,
    default: 'Free', // Set 'Free' as the default plan
  },
  start_date: {
    type: Date,
    required: true,
    default: Date.now, // Default to the current date
  },
  end_date: {
    type: Date,
  },
});

const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  subdomain: {
    type: String,
    // required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    // required: true,
  },
  owner_id: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (owner)
    // required: true,
  },
  subscription: {
    type: subscriptionSchema,
    required: true,
    default: () => ({ plan: 'Free', start_date: Date.now() }), // Default to 'Free' plan
  },
  logo_url: {
    type: String,
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
restaurantSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;

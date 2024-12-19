const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
  plan: {
    type: String,
    enum: ['Free', 'Basic', 'Standard', 'Premium'], 
    required: true,
    default: 'Free', 
  },
  start_date: {
    type: Date,
    required: true,
    default: Date.now, 
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
  },
  owner_id: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
  },
  subscription: {
    type: subscriptionSchema,
    required: true,
    default: () => ({ plan: 'Free', start_date: Date.now() }), 
  },
  logo_url: {
    type: String,
    default : 'https://via.placeholder.com/150'
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

restaurantSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;

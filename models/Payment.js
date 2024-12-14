const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  restaurant_id: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant', // Reference to the Restaurant model
    required: true,
  },
  order_id: {
    type: Schema.Types.ObjectId,
    ref: 'Order', // Reference to the Order model (optional)
  },
  amount: {
    type: Number,
    required: true,
  },
  payment_date: {
    type: Date,
    default: Date.now,
  },
  payment_method: {
    type: String,
    enum: ['Credit Card', 'UPI', 'Cash'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Success', 'Failed', 'Pending'],
    required: true,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;

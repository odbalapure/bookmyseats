const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  user: {
    name: String,
    email: String,
    phone: String,
  },
  name: String,
  date: String,
  from: String,
  to: String,
  seats: Array,
  theaterId: mongoose.Types.ObjectId,
  theaterName: String,
  amount: Number,
  isPaid: Boolean,
  razorpay: {
    orderId: String,
    paymentId: String,
    signature: String,
  },
});

module.exports = mongoose.model("Booking", BookingSchema);

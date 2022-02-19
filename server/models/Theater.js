const mongoose = require("mongoose");

const TheaterSchema = new mongoose.Schema({
  owner: String,
  name: String,
  helpline: String,
  userId: String,
  city: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Theater", TheaterSchema);

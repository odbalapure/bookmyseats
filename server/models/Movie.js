const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  name: String,
  image: String,
  pgRating: String,
  theaterName: String,
  theaterId: String,
  releaseDate: Date,
  from: String,
  to: String,
  genre: String,
  city: String,
  runtime: Number,
  userId: mongoose.Schema.Types.String,
});

module.exports = mongoose.model("Movie", MovieSchema);

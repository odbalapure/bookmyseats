const Movie = require("../models/Movie");

/**
 * @desc  Get movies
 * @param {*} req
 * @param {*} res
 */
const getAllMovies = async (req, res) => {
  let search = req.query.search;
  if (search) {
    search = req.query.search;
  } else {
    search = "";
  }

  const movies = await Movie.find({
    name: { $regex: search, $options: "i" },
  });
  
  res.status(200).json({ movies, length: movies.length });
};

/**
 * @desc  Get movies
 * @param {*} req
 * @param {*} res
 */
const getMovie = async (req, res) => {
  const movie = await Movie.findOne({ _id: req.params.id });
  res.status(200).json({ movie });
};

/**
 * @desc  Create a movie
 * @param {*} req
 * @param {*} res
 */
const createMovie = async (req, res) => {
  const movie = await Movie.create({
    ...req.body,
    userId: req.user.userId,
  });
  res.status(200).json({ movie, msg: "Movies created" });
};

/**
 * @desc Get show timings for a movie
 * @param {*} req
 * @param {*} res
 */
const getMovieShowTimings = async (req, res) => {
  const movies = await Movie.find({ name: req.params.name });
  res.status(200).json({ movies, length: movies.length });
};

module.exports = { getAllMovies, getMovie, getMovieShowTimings, createMovie };

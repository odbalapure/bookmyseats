const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authentication");

const {
  getAllMovies,
  createMovie,
  getMovie,
  getMovieShowTimings,
} = require("../controllers/movies");

router.route("/:id").get(getMovie);
router.route("/timings/:name").get(getMovieShowTimings);
router.route("/").get(getAllMovies);
router.route("/").post(authMiddleware, createMovie);

module.exports = router;

const express = require("express");
const router = express.Router();

const {
  bookShow,
  checkBookedSeats,
  getAllBookings,
} = require("../controllers/bookings");

router.route("/").post(bookShow);
router.route("/").get(checkBookedSeats);
router.route("/shows").get(getAllBookings);

module.exports = router;

const User = require("../models/User");
const Booking = require("../models/Booking");
const Theater = require("../models/Theater");

const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

/**
 * @desc Configure mail
 */
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SEND_GRID_TOKEN,
    },
  })
);

/**
 * @desc Book a show
 * @param {*} req
 * @param {*} res
 */
const bookShow = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });

  const booking = {
    userId: req.user.userId,
    userName: user.name,
    userPhone: user.phone,
    userEmail: user.email,
    movie: req.body,
  };

  await Booking.create(booking);

  // transporter.sendMail({
  //   to: user.email,
  //   from: "ombalapure@outlook.com",
  //   subject: "BookMySeat booking confirmation",
  //   html: `<h4>Hi ${user.name}!</h4>
  //     <p>Your booking for the ${booking.movie.name} has been confirmed.</p>
  //     <p><b>Show timing</b>: ${booking.movie.from} to ${booking.movie.to}</p>
  //     <p><b>Date</b>: ${booking.movie.date}</p>
  //     <p><b>Seats</b>: ${booking.movie.seats}</p>
  //     <p><b>Total amount</b>: ${booking.movie.price}</p>
  //     <p><b>Thanks,</b></p>
  //     <p><b><i>BookMySeat ©</i></b></p>
  //   `,
  // });

  res.status(200).json({
    msg: `Hey ${user.name}, your booking has been confirmed!`,
  });
};

/**
 * @desc Check for booked seats
 * @param {*} req
 * @param {*} res
 */
const checkBookedSeats = async (req, res) => {
  try {
    const search = JSON.parse(req.query.searchObj);

    try {
      const bookedSeats = await Booking.find({
        "movie.theaterId": search.theaterId,
        "movie.theaterName": search.theaterName,
        "movie.from": search.from,
        "movie.to": search.to,
        "movie.name": search.movieName,
        "movie.date": search.date,
      });

      const seats = [];
      if (!bookedSeats) {
        console.log("No seats found");
      } else {
        bookedSeats.map((bookings) => {
          bookings.movie.seats.map((seat) => {
            seats.push(seat);
          });
        });
      }

      res.status(200).json({ seats });
    } catch (err) {
      console.log("Inner:", err);
      return res
        .status(200)
        .json({ msg: "No seats are booked for this show for now..." });
    }
  } catch (err) {
    console.log("Outer:", err);
    return res
      .status(500)
      .json({ msg: "Something went wrong while getting booked seats data..." });
  }
};

/**
 * @desc Get all bookings for a theater
 * @param {*} req
 * @param {*} res
 */
const getAllBookings = async (req, res) => {
  const theaters = await Theater.find({ userId: req.user.userId });
  const bookings = [];

  for (let i = 0; i < theaters.length; i++) {
    const shows = await Booking.find({ "movie.theaterId": theaters[i]._id });
    bookings.push(shows);
  }

  res.status(200).json({ bookings });
};

module.exports = {
  bookShow,
  checkBookedSeats,
  getAllBookings,
};

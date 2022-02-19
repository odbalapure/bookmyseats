const RazorPay = require("razorpay");
const Booking = require("../models/Booking");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

/**
 * @desc Configure sendgrid email service
 */
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SEND_GRID_TOKEN,
    },
  })
);

/**
 * @desc Send razorpay key id
 * @param {*} req
 * @param {*} res
 */
const getRazorpayKey = (req, res) => {
  res.send({ key: process.env.RAZORPAY_KEY_ID });
};

/**
 * @desc Create an order
 * @param {*} req
 * @param {*} res
 */
const createOrder = async (req, res) => {
  try {
    const instance = new RazorPay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: req.body.amount,
      currency: "INR",
    };

    const order = await instance.orders.create(options);
    res.status(200).json({ order });
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong..." });
  }
};

/**
 * @desc Pay for the orodr
 */
const payOrder = async (req, res) => {
  try {
    const { amount, razorpayPaymentId, razorpayOrderId, razorpaySignature } =
      req.body;

    const booking = Booking({
      user: req.body.user,
      name: req.body.name,
      theaterId: req.body.theaterId,
      theaterName: req.body.theaterName,
      seats: req.body.seats,
      from: req.body.from,
      to: req.body.to,
      date: req.body.date,
      isPaid: true,
      amount: parseFloat(amount / 100),
      razorpay: {
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
      },
    });

    await booking.save();

    /* Sending email confirmation after payment */
    transporter.sendMail({
      to: booking.user.email,
      from: "ombalapure@outlook.com",
      subject: "BookMySeats - Booking Confirmed",
      html: `<h4>Hi ${booking.user.name}!</h4>
        <p>Your booking for the show - <b>${booking.name}</b> has been confirmed.</p>
        <p><b>Show timing</b>: ${booking.from} to ${booking.to}</p>
        <p><b>Date</b>: ${booking.date}</p>
        <p><b>Seats</b>: ${booking.seats}</p>
        <p><b>Total amount</b>: ₹${booking.amount}</p>
        <p><b>Thanks,</b></p>
        <p><b><i>BookMySeat ©</i></b></p>
      `,
    });

    res.send({
      msg: "Payment was successfull",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports = { getRazorpayKey, createOrder, payOrder };

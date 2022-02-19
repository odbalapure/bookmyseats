const express = require("express");
const router = express.Router();

const {
  createOrder,
  payOrder,
  getRazorpayKey
} = require("../controllers/payments");

router.route("/get-razorpay-key").get(getRazorpayKey);
router.route("/create-order").post(createOrder);
router.route("/pay-order").post(payOrder);

module.exports = router;

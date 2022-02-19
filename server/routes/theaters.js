const express = require("express");
const router = express.Router();

const {
  createTheater,
  getTheaters,
  deleteTheater,
  editTheater,
} = require("../controllers/theaters");

router.route("/").get(getTheaters);
router.route("/").post(createTheater);
router.route("/:id").delete(deleteTheater);
router.route("/:id").patch(editTheater);

module.exports = router;

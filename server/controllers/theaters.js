const Theater = require("../models/Theater");

/**
 * @desc  Get theaters
 * @param {*} req
 * @param {*} res
 */
const getTheaters = async (req, res) => {
  const theaters = await Theater.find({
    userId: req.user.userId,
  });

  console.log("Getting theaters...");
  res.status(200).json({ theaters, length: theaters.length });
};

/**
 * @desc  Create a theater
 * @param {*} req
 * @param {*} res
 */
const createTheater = async (req, res) => {
  const theater = await Theater.create({
    ...req.body,
    userId: req.user.userId,
  });
  res.status(200).json({ theater, msg: "Theater created" });
};

/**
 * @desc  Delete a theater
 * @param {*} req
 * @param {*} res
 */
const deleteTheater = async (req, res) => {
  await Theater.findOneAndRemove({
    _id: req.params.id,
  });

  res.status(200).json({ msg: "Theater deleted!" });
};

/**
 * @desc  Edit a theater
 * @param {*} req
 * @param {*} res
 */
const editTheater = async (req, res) => {
  await Theater.findByIdAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ msg: "Theater details edited!" });
};

module.exports = { getTheaters, createTheater, editTheater, deleteTheater };

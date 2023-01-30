const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");

const billingSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [40, "Name cannot exceed 28 characterr"],
    minLength: [3, "Name should have more  then 3 characters"],
  },
  email: {
    type: String,
    required: [true, "Please add your Email"],
    validate: [validator.isEmail, "Please add your valid Email"],
  },
  phone: {
    type: String,
    required: [true, "Please add your number"],
    minlength: [11, "Number can never be less then 11"],
    maxLength: [11, "Number cannot have more then 11 character"],
  },
  payableAmount: {
    type: Number,
    required: [true, "Please add your payable amount"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Billing", billingSchema);

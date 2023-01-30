const tryCatch = require("../middleware/tryCatch");
const sendJwtToken = require("../utils/sendJwtToken");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const ErrorHandler = require("../utils/errorHandler");
const sendEmail = require("../utils/sendEmail");

/** register user  ⩢ */
exports.registerUser = tryCatch(async (req, res, next) => {
  const userData = req.body;
  const { name, email, password } = userData;
  /* needed confirm Password ⩢  */
  if (!req.body.confirmPassword) {
    return next(new ErrorHandler(" required confirmPassword field", 400));
  }
  /* match password and conform password ⩢  */
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }
  /* make a hash password ⩢  */
  const hashPassword = await bcrypt.hash(password, 10);
  const userInfo = await User.create({
    name,
    email,
    password: hashPassword,
  });
  const user = await User.findOne({ _id: userInfo._id });
  /** Get jwt token and store token on cookie  ⩢  */
  sendJwtToken(user, 200, res);
});

/** login  User ⩢ */
exports.loginUser = tryCatch(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password"));
  }
  /** if user not finding on database ⩢  */
  const user = await User.findOne({ email }).populate("billing");
  if (!user) {
    return next(new ErrorHandler("Invalid user email or password"));
  }

  /** Check user password is isValid ⩢ */
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return next(new ErrorHandler("Invalid user email or password"));
  }

  sendJwtToken(user, 200, res);
});

/** Logout User ⩢ */
exports.logOutUser = tryCatch(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
});

/** forgot password ⩢ */
exports.forgotPassword = tryCatch(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }
  const resetToken = user.getResetPassword();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  // const resetPasswordUrl = `${req.protocol}://${req.get(
  //   "host"
  // )}/password/reset/${resetToken}`;
  const message = `your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you are not requested this email then please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Billing application password recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email send to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

/** reset Password password ⩢ */
exports.resetPassword = tryCatch(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been expired",
        400
      )
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }
  const hashPassword = await bcrypt.hash(req.body.password, 10);

  user.password = hashPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  sendJwtToken(user, 200, res);
});

/** Get User Details */
exports.getUserDetails = tryCatch(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("billing");

  res.status(200).json({
    success: true,
    user,
  });
});

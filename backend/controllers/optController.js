const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const sendEmail = require("../utils/email");
const { promisify } = require("util");
const Employer = require("../models/EmployerModel");

exports.sendOtp = asyncHandler(async (req, res, next) => {
  const user = req.user ? req.user : req.employer;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000;
  // if (req.user) {
  //   req.user.otp = otp;
  //   req.user.otpExpires = Date.now() + 10 * 60 * 1000;
  // } else {
  //   req.employer.otp = otp;
  //   req.employer.otpExpires = Date.now() + 10 * 60 * 1000;
  // }

  const mailOptions = {
    from: "JobSeek <noreply@jobseek.com>",
    to: user.email ? user.email : user.companyEmail, // Send OTP to the current email
    subject: "Your OTP for Account Settings Change",
    text: `Your OTP for Account Settings Change Is: ${otp}. It is valid for 10 minutes.`,
  };

  try {
    await sendEmail(mailOptions);
    await user.save({ validateBeforeSave: false });
    // if (req.user) {
    //   await req.user.save({ validateBeforeSave: false });
    // } else {
    //   await req.employer.save({ validateBeforeSave: false });
    // }
    res.status(200).json({
      status: "success",
      message: "OTP sent to your email.",
    });
  } catch (err) {
    return next(new AppError(500, "There was a problem sending the email"));
  }
});

exports.validateOtp = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body.dataTochange;
  // console.log(email, password);
  let user = await User.findOne({ otp: req.body.otp }).select("-reviews");
  if (!user)
    user = await Employer.findOne({ otp: req.body.otp }).select("-reviews");
  if (!user) return next(new AppError(404, "User not found"));
  // console.log("hello");

  // Need to validate otp date!

  if (email) {
    // console.log("email");
    if (user.email) {
      // console.log("user");
      user.email = email;
    } else {
      // console.log("employer");
      user.companyEmail = email;
      // console.log(user);
    }
  } else if (password) {
    user.password = password;
  }
  user.otp = undefined;
  user.otpExpires = undefined;
  // console.log(user);

  await user.save();
  res.status(200).json({
    status: "success",
    message: "Account settings has been changed successfully.",
  });
});

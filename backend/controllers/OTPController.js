const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const sendEmail = require("../utils/email");
const { promisify } = require("util");
const Employer = require("../models/EmployerModel");

exports.sendOtpForPasswordChange = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId);

  if (!user)
    return next(new AppError(404, "No account associated with this user"));

  const otp = user.createOtp();
  await user.save({ validateBeforeSave: false });

  const mailOptions = {
    from: "JobSeek <noreply@jobseek.com>",
    to: user.email,
    subject: "Your OTP for Password Change",
    text: `Your OTP for password change is: ${otp}. It is valid for 10 minutes.`,
  };

  try {
    await sendEmail(mailOptions);
    res.status(200).json({
      status: "success",
      message: "OTP sent to your email.",
    });
  } catch (err) {
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError(500, "There was a problem sending email"));
  }
});

exports.sendOtpForPasswordChangeEmployer = asyncHandler(
  async (req, res, next) => {
    const employerId = req.employer._id;
    const employer = await Employer.findById(employerId);

    if (!employer) {
      return next(
        new AppError(404, "No account associated with this Employer")
      );
    }

    const otp = employer.createOtp();
    await employer.save({ validateBeforeSave: false });

    const mailOptions = {
      from: "JobSeek <noreply@jobseek.com>",
      to: employer.companyEmail,
      subject: "Your OTP for Password Change",
      text: `Your OTP for password change is: ${otp}. It is valid for 10 minutes.`,
    };

    try {
      await sendEmail(mailOptions);
      res.status(200).json({
        status: "success",
        message: "OTP sent to your email.",
      });
    } catch (err) {
      employer.otp = undefined;
      employer.otpExpires = undefined;
      await employer.save({ validateBeforeSave: false });
      return next(new AppError(500, "There was a problem sending email"));
    }
  }
);

exports.verifyOtpAndChangePassword = asyncHandler(async (req, res, next) => {
  const { otp, password, confirmPassword } = req.body;

  const user = await User.findOne({
    otp,
    otpExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError(400, "Invalid or expired OTP."));
  }

  if (password !== confirmPassword) {
    return next(new AppError(400, "Passwords do not match."));
  }

  user.password = password;
  user.otp = undefined;
  user.otpExpires = undefined;

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password has been changed successfully.",
  });
});

exports.verifyOtpAndChangePasswordEmployer = asyncHandler(
  async (req, res, next) => {
    const { otp, password, confirmPassword } = req.body;

    const employer = await Employer.findOne({
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!employer) {
      return next(new AppError(400, "Invalid or expired OTP."));
    }

    if (password !== confirmPassword) {
      return next(new AppError(400, "Passwords do not match."));
    }

    employer.password = password;
    employer.otp = undefined;
    employer.otpExpires = undefined;

    await employer.save();

    res.status(200).json({
      status: "success",
      message: "Password has been changed successfully.",
    });
  }
);

exports.protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new AppError("Not authorized, please log in", 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new AppError("The user belonging to this token no longer exists", 401)
    );
  }

  req.user = user;
  next();
});

exports.protectEmployer = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new AppError("Not authorized, please log in", 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const employer = await Employer.findById(decoded.id);
  if (!employer) {
    return next(
      new AppError("The user belonging to this token no longer exists", 401)
    );
  }

  req.employer = employer;
  next();
});

exports.sendOtpForEmailChange = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user) return next(new AppError(404, "User not found"));

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  const mailOptions = {
    from: "JobSeek <noreply@jobseek.com>",
    to: user.email,
    subject: "Your OTP for Email Change",
    text: `Your OTP for email change is: ${otp}. It is valid for 10 minutes.`,
  };

  try {
    await sendEmail(mailOptions);
    res.status(200).json({
      status: "success",
      message: "OTP sent to your email.",
    });
  } catch (err) {
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError(500, "There was a problem sending the email"));
  }
});

exports.sendOtpForEmailChangeEmployer = asyncHandler(async (req, res, next) => {
  const employerId = req.employer.id;

  const employer = await Employer.findById(employerId);
  if (!employer) return next(new AppError(404, "Employer not found"));

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  employer.otp = otp;
  employer.otpExpires = Date.now() + 10 * 60 * 1000;

  await employer.save({ validateBeforeSave: false });

  const mailOptions = {
    from: "JobSeekForEmployers <noreply@jobseek.com>",
    to: employer.companyEmail,
    subject: "Your OTP for Email Change",
    text: `Your OTP for email change is: ${otp}. It is valid for 10 minutes.`,
  };

  try {
    await sendEmail(mailOptions);
    res.status(200).json({
      status: "success",
      message: "OTP sent to your email.",
    });
  } catch (err) {
    employer.otp = undefined;
    employer.otpExpires = undefined;
    await employer.save({ validateBeforeSave: false });
    return next(new AppError(500, "There was a problem sending the email"));
  }
});

exports.verifyOtpAndChangeEmail = asyncHandler(async (req, res, next) => {
  const { otp, email } = req.body;

  const user = await User.findOne({
    otp,
    otpExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError(400, "Invalid or expired OTP."));
  }

  user.email = email;
  user.otp = undefined;
  user.otpExpires = undefined;

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Email address has been changed successfully.",
  });
});

exports.verifyOtpAndChangeEmailEmployer = asyncHandler(
  async (req, res, next) => {
    const { otp, email } = req.body;

    const employer = await Employer.findOne({
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!employer) {
      return next(new AppError(400, "Invalid or expired OTP."));
    }

    employer.companyEmail = email;
    employer.otp = undefined;
    employer.otpExpires = undefined;

    await employer.save();

    res.status(200).json({
      status: "success",
      message: "Email address has been changed successfully.",
    });
  }
);

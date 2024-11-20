const bcrypt = require("bcryptjs");
const Employer = require("../models/EmployerModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const sendEmail = require("../utils/email");
const crypto = require("crypto");
const mongoose = require("mongoose");
const User = require("../models/userModel");

// Create a new employer user
exports.createEmployerUser = asyncHandler(async (req, res) => {
  const { password, confirmPassword, email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email must be provided" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  const newEmployer = new Employer({
    password,
    companyEmail: email,
    role: "employer",
  });

  await newEmployer.save();

  res.status(201).json({
    message: "Employer created successfully",
    data: newEmployer,
  });
});

// Log in an employer and issue a JWT
exports.loginEmployer = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const employer = await Employer.findOne({ companyEmail: email }).select(
    "+password"
  );
  if (!employer) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, employer.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: employer._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie("jwt", token, {
    secure: true,
    sameSite: "none",
    expires: new Date(Date.now() + 86_400_400 * 14),
  });

  res.status(200).json({
    status: "success",
    token,
    data: {
      id: employer._id,
      companyName: employer.companyName,
      companyEmail: employer.companyEmail,
      companyLogo: employer.companyLogo,
    },
  });
});

// Send a password reset email to the employer
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError(401, "Bad request: email is missing"));
  }
  const employer = await Employer.findOne({ companyEmail: email });
  if (!employer) {
    return next(
      new AppError(404, "No account associated with the given email")
    );
  }

  const resetToken = employer.createPasswordResetToken();
  await employer.save({ validateBeforeSave: false });

  const resetUrl = `http://localhost:5173/resetPassword?token=${resetToken}`;

  const mailOptions = {
    from: "JobSeek <noreply@jobseek.com>",
    to: employer.companyEmail,
    subject: "Password Reset",
    text: `<h3>Please follow this link to reset your password</h3> <a href="${resetUrl}">Click here to reset your password</a>`,
  };

  try {
    await sendEmail(mailOptions);

    res.status(200).json({
      status: "success",
      message: "The email has been sent",
    });
  } catch (err) {
    employer.passwordResetToken = undefined;
    employer.passwordResetExpires = undefined;
    await employer.save({ validateBeforeSave: false });
    return next(new AppError(500, "There was a problem sending the email"));
  }
});

// Reset the employer's password using the provided token
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const { token } = req.params;
  if (!password || !confirmPassword || !token) {
    return next(new AppError(401, "Missing details"));
  }
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const employer = await Employer.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gte: Date.now() },
  }).select("+password");
  if (!employer) {
    return next(new AppError(400, "Token is invalid or has expired"));
  }
  const isSamePassword = await employer.checkPassword(
    password,
    employer.password
  );
  if (isSamePassword) {
    return next(
      new AppError(
        400,
        "This password has already been used. Try a different one."
      )
    );
  }

  employer.password = password;
  employer.confirmPassword = confirmPassword;
  employer.passwordResetToken = undefined;
  employer.passwordResetExpires = undefined;

  await employer.save();

  res.status(200).json({
    status: "success",
    message: "The password has been changed",
  });
});

// Retrieve the employer's profile along with their jobs
exports.getEmployerWithJobs = asyncHandler(async (req, res, next) => {
  const employer = await Employer.findById(req.user._id).populate("jobs");

  if (!employer) {
    return next(new AppError(404, "Employer not found"));
  }

  res.status(200).json({
    status: "success",
    employer,
  });
});

// Get the employer's profile details
exports.getEmployerProfile = asyncHandler(async (req, res) => {
  const employer = await Employer.findById(req.employer._id);
  console.log("hello");

  if (!employer) {
    return res.status(404).json({
      status: "fail",
      message: "Employer not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      employer,
    },
  });
});

// Update the employer's profile information
exports.updateEmployerProfile = asyncHandler(async (req, res) => {
  const employerId = req.employer._id;
  console.log(employerId, req.body);

  const { companyName, companyDescription, companySize, companyContact } =
    req.body;

  const updatedEmployer = await Employer.findByIdAndUpdate(
    employerId,
    {
      companyName,
      companyDescription,
      companySize,
      companyContact,
    },
    { new: true, runValidators: true }
  );

  if (!updatedEmployer) {
    return res
      .status(404)
      .json({ status: "fail", message: "Employer not found" });
  }

  res.status(200).json({
    status: "success",
    data: {
      employer: updatedEmployer,
    },
  });
});

// Update the employer's profile picture (company logo)
exports.updateProfilePicture = asyncHandler(async (req, res, next) => {
  const { profilePicture } = req.body;

  if (!profilePicture) {
    return res
      .status(400)
      .json({ message: "Profile picture URL is required." });
  }

  const employer = await Employer.findById(req.user.id);

  if (!employer) {
    return res.status(404).json({ message: "Employer not found." });
  }

  employer.companyLogo = profilePicture;
  await employer.save();

  res.status(200).json({
    status: "success",
    message: "Profile picture updated successfully.",
    employer,
  });
});

exports.getProfilePicture = asyncHandler(async (req, res, next) => {
  const employer = await Employer.findById(req.employer._id).select(
    "companyLogo"
  );

  if (!employer) {
    return res.status(404).json({ message: "Employer not found." });
  }

  res.status(200).json({
    status: "success",
    companyLogo: employer.companyLogo,
  });
});

// Add a review for the employer by a candidate
exports.addEmployerReview = asyncHandler(async (req, res, next) => {
  const { employerId } = req.params;
  const { ratings, notes } = req.body;

  if (!ratings || !notes) {
    return res.status(400).json({
      status: "fail",
      message: "Ratings and notes are required.",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(employerId)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid employer ID",
    });
  }

  const employer = await Employer.findById(employerId);
  if (!employer) {
    return res.status(404).json({
      status: "fail",
      message: "No employer found with that ID",
    });
  }

  const review = {
    userId: req.user._id,
    ratings,
    notes,
  };

  employer.reviews.push(review);

  const notifications = {
    userId: req.user._id,
    message: `${req.user.firstName} ${req.user.lastName}  השאיר דירוג על ${employer.companyName} `,
  };
  employer.notifications.push(notifications);
  await employer.save();
  res.status(200).json({
    status: "success",
    data: review,
  });
});

// Get the ratings of candidates for a specific employer
exports.getCandidateRatings = asyncHandler(async (req, res, next) => {
  const { employerId } = req.params;

  const employer = await Employer.findById(employerId).select("reviews");

  if (!employer) {
    return res.status(404).json({ message: "Employer not found" });
  }

  res.status(200).json({
    message: "Job reviews fetched successfully",
    data: employer,
  });
});

// Get the details of the employer for a specific job
exports.getEmployerDetailsForJob = asyncHandler(async (req, res) => {
  const { employerId } = req.params;

  const employer = await Employer.findById(employerId);
  if (!employer) {
    res.status(404).json({ message: "Employer not found" });
    return;
  }

  res.status(200).json({
    companyName: employer.companyName,
    companyLogo: employer.companyLogo,
  });
});

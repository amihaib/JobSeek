const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const Employer = require("../models/EmployerModel"); // Adjust the path to your Employer model
const AppError = require("../utils/AppError"); // Assuming you have an AppError utility
const asyncHandler = require("express-async-handler");

exports.protect = asyncHandler(async (req, res, next) => {
  // 1. Check if the cookies are available and contain a JWT
  if (!req.cookies || !req.cookies.jwt) {
    return next(new AppError(403, "Please log in to access."));
  }

  const token = req.cookies.jwt;

  // 2. Verify the JWT
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if the token has expired
  if (!decoded || decoded.exp <= Date.now() / 1000) {
    return next(
      new AppError(403, "Your session has expired. Please log in again.")
    );
  }

  // 4. Find the employer based on the decoded token's ID
  const employer = await Employer.findById(decoded.id);
  if (!employer) {
    return next(
      new AppError(
        403,
        "The employer associated with this token no longer exists."
      )
    );
  }

  // 5. Grant access to the employer by attaching the employer object to the req object
  req.user = employer;
  next();
});

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const Employer = require("../models/EmployerModel");
const Job = require("../models/jobModel");
const { promisify } = require("util");
// Create a JWT token
exports.protectJob = asyncHandler(async (req, res, next) => {
  // Verify that the JWT exists in cookies or headers
  let token;
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError(403, "You are not logged in. Please log in to get access")
    );
  }

  // Decode the JWT and extract employer information
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const employer = await Employer.findById(decoded.id);
  if (!employer) {
    return next(
      new AppError(401, "Employer belonging to this token does not exist.")
    );
  }
  req.employer = employer;

  next();
});

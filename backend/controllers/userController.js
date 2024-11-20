const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const asyncHandler = require("express-async-handler");
const CV = require("../models/cvModel");
const Rank = require("../models/rankModel");
const Employer = require("../models/EmployerModel");

// Get user details by user ID
exports.getUserById = asyncHandler(async (req, res, next) => {
  // console.log(req.user, req.employer);
  // const user = req.user
  //   ? await User.findById(req.user._id).select("-reviews")
  //   : await Employer.findById(req.employer._id).select("-reviews");
  const user = req.user ? req.user.toObject() : req.employer.toObject();
  delete user.reviews;

  if (!user) return next(new AppError(403, "No user found"));
  return res.status(200).json({
    status: "success",
    data: user,
  });
});

// Get the user's profile information
exports.getUserProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select(
    "firstName lastName phoneNumber"
  );
  if (!user) return next(new AppError(403, "No user found"));
  return res.status(200).json({
    status: "success",
    user,
  });
});

// Update the user's profile information
exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
  });
  if (!updatedUser) return next(new AppError(404, "User not found"));
  res.status(200).json({
    status: "success",
    user: updatedUser,
  });
});

// Get a list of users based on filters
exports.getUsers = asyncHandler(async (req, res, next) => {
  console.log("Query Parameters Received:", req.query);
  const { profession, city, experience } = req.query;
  const query = {
    visibleToEmployers: true,
  };
  if (profession) {
    query.profession = { $regex: profession, $options: "i" }; // Case-insensitive match
  }
  if (city) {
    query.city = { $regex: city, $options: "i" }; // Case-insensitive match
  }
  if (experience !== undefined) {
    query.experience = parseInt(experience, 10); // Exact match, ensure experience is a number
  }

  const users = await User.find(query);
  console.log("Users Found:", users);
  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users },
  });
});

// Get the CV of a specific user
exports.getUserCv = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  const user = await User.findOne({ _id: userId });
  if (!user) return next(new AppError(404, "User not found"));
  const cv = await CV.findOne({ user: user._id });
  if (!cv) return next(new AppError(404, "CV not found"));

  if (req.body.notifaction) {
    const notifications = {
      employerId: req.employer._id,
      message: `${req.employer.companyName} ראה את הקורות חיים שלך `,
    };
    user.notifications.push(notifications);
    await user.save();
  }

  res.status(200).json({
    status: "success",
    cvUrl: cv.cvUrl,
  });
});

// Get the user's first and last name

// Update the user's profile picture
exports.updateProfilePicture = async (req, res) => {
  const { profilePicture } = req.body;
  const userId = req.user.id; // Assuming you have user authentication

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res
      .status(200)
      .json({ success: true, message: "Profile picture updated.", user });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
exports.getProfileNameAndLastName = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select(
    "firstName lastName profilePicture"
  );
  if (!user) return next(new AppError(404, "User not found"));

  res.status(200).json({
    status: "success",
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
    },
  });
});

// Get detailed user information
exports.getUserDetails = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select(
    "firstName lastName email phoneNumber city profession experience"
  );
  if (!user) return next(new AppError(404, "User not found"));

  res.status(200).json({
    status: "success",
    data: user,
  });
});

// Get candidate ratings for a specific user
exports.getCandidateRatings = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  console.log(userId);

  const user = await User.findById(userId).select("reviews");
  console.log(user);

  if (!user) return next(new AppError(404, "User not found"));

  res.status(200).json({
    message: "Ratings fetched successfully",
    data: user.reviews,
  });
});

// Update the ranking for a candidate
exports.updateRanking = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { ratings, notes } = req.body;
  const reviews = {
    employerId: req.employer._id,
    ratings,
    notes,
  };

  const user = await User.findById(userId);
  if (!user) return next(new AppError(404, "User not found"));

  user.reviews.push(reviews);
  // await user.save();
  const notifications = {
    employerId: req.employer._id,
    message: `${req.employer.companyName} השאיר עליך דירוג `,
  };
  user.notifications.push(notifications);
  await user.save();

  res.status(200).json({
    status: "success",
    data: reviews,
  });
});
exports.getNotifications = asyncHandler(async (req, res, next) => {
  const userNotifications = req.user
    ? req.user.notifications
    : req.employer.notifications;

  const userNewNotifications = req.user
    ? req.user.newNotifications
    : req.employer.notifications;
  res.status(200).json({
    status: "success",
    data: {
      notifications: userNotifications,
      newNotifications: userNewNotifications,
    },
  });
});

exports.deleteNotifications = asyncHandler(async (req, res, next) => {
  const user = req.user ? req.user : req.employer;
  user.notifications = [];
  user.newNotifications = 0;
  await user.save();
  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.markNotificationAsRead = asyncHandler(async (req, res, next) => {
  const user = req.user ? req.user : req.employer;
  const { notificationId } = req.params;

  // Find the notification
  const notification = user.notifications.find((notification) => {
    return notification._id.toString() === notificationId;
  });

  // If the notification exists and is not read, mark it as read
  if (notification && !notification.read) {
    notification.read = true;
    user.newNotifications--; // Decrement new notifications
  }

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Notification marked as read",
    data: user.newNotifications,
  });
});

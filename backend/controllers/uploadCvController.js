const multer = require("multer");
const User = require("../models/userModel");
const AppError = require("../utils/AppError"); // Custom error handler
const CV = require("../models/cvModel");
const asyncHandler = require("express-async-handler");
const axios = require("axios");

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/cvs"); // This should be the folder where CVs are stored locally
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}-${Date.now()}-${file.originalname}`);
  },
});

// File filter to allow only PDFs and DOCX files
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("File type not allowed. Only PDF and DOCX are allowed."),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
}).single("cv"); // 'cv' should match the field name from the frontend

// Upload CV function with authentication check
exports.uploadCv = asyncHandler(async (req, res, next) => {
  const { cvUrl, fileName } = req.body;

  if (!cvUrl || !fileName) {
    return res.status(400).json({
      status: "failed",
      message: "cvUrl and fileName are required.",
    });
  }

  const newCv = await CV.create({
    cvUrl,
    fileName,
    user: req.user.id, // Assuming you're associating the CV with a logged-in user
  });

  res.status(201).json({
    status: "success",
    data: newCv,
  });
});

// Get CVs uploaded by the logged-in user
exports.getUserCVs = asyncHandler(async (req, res, next) => {
  const userId = req.user.id; // Get user ID from JWT

  // Fetch user data and populate their CVs
  const user = await User.findById(userId).populate("cvs");

  if (!user) {
    return res.status(404).json({ status: "fail", message: "User not found" });
  }

  res.status(200).json({
    status: "success",
    data: {
      cvs: user.cvs, // Return the user's CVs as an array
    },
  });
});

exports.deleteCv = asyncHandler(async (req, res, next) => {
  const cvId = req.params.id;
  const userId = req.user.id;

  // Find the CV
  const cv = await CV.findById(cvId);
  if (!cv) {
    return res.status(404).json({
      status: "fail",
      message: "CV not found",
    });
  }

  // Ensure the CV belongs to the user
  if (cv.user.toString() !== userId) {
    return res.status(403).json({
      status: "fail",
      message: "You are not authorized to delete this CV",
    });
  }

  // Delete the CV
  await CV.findByIdAndDelete(cvId);

  // Remove the CV reference from the user's cv array
  await User.findByIdAndUpdate(userId, {
    $pull: { cv: cvId },
  });

  res.status(200).json({
    status: "success",
    message: "CV deleted successfully",
  });
});

exports.downloadCv = async (req, res) => {
  try {
    // Get the userId from the JWT (req.user should contain the authenticated user's data if the route is protected)
    const userId = req.user.id; // Assuming req.user contains the user ID from JWT
    const fileName = req.params.fileName;

    // Log for debugging purposes
    console.log(`User ID: ${userId}, File Name: ${fileName}`);

    // Find the CV document based on the file name and user ID
    const cv = await CV.findOne({ fileName, user: userId });

    if (!cv) {
      return res.status(404).json({
        status: "fail",
        message: "File not found or you do not have permission to access it.",
      });
    }

    const fileUrl = cv.cvUrl; // Firebase URL

    // Fetch the file from Firebase Storage
    const response = await axios({
      url: fileUrl,
      method: "GET",
      responseType: "stream", // Stream the file data
    });

    // Set headers to force a download
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.setHeader("Content-Type", response.headers["content-type"]);

    // Pipe the data from Firebase to the client
    response.data.pipe(res);
  } catch (error) {
    console.error("Error fetching the file:", error);
    res.status(500).json({ message: "Error downloading file" });
  }
};

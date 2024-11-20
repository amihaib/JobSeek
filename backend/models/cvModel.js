const mongoose = require("mongoose");

const cvSchema = new mongoose.Schema({
  cvUrl: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const CV = mongoose.model("CV", cvSchema);
module.exports = CV;

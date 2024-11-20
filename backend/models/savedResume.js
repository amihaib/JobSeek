const mongoose = require("mongoose");
const User = require("./userModel");

const resumeScheme = new mongoose.Schema({

    name:{
    type:String,

    },
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
})
const Resume = mongoose.model("Resume", resumeScheme);
module.exports = Resume;
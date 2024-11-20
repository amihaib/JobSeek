const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: [true, "must type task"],
    },
    jobDescription: {
      type: String,
      required: [true, "type description"],
    },
    dueDate: {
      type: Date,
      // default: Date.now(),
    },
    jobCity: {
      type: String,
      required: [true, "must type city"],
    },
    jobRequirements: {
      type: String,
      required: [true, "must type experiences"],
    },

    jobField: {
      type: String,
      required: [true, "must type field"],
    },
    jobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Freelance"], // Define the available options
      required: [true, "must select job type"], // Ensure it's required
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "Employer",
      required: [true, "must have an Employer"],
    },
    jobSalary: {
      type: Number,
    },
    candidates: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        coverLetter: { type: String, required: false },
        status: {
          type: String,
          enum: ["fit", "pending", "unfit"],
          default: "pending",
        },
      },
    ],
    jobs: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Job", // Reference to the Job model
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;

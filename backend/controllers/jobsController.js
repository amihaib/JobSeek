const User = require("../models/userModel");
const Job = require("../models/jobModel");
const AppError = require("../utils/AppError");
const asyncHandler = require("express-async-handler");
const Employer = require("../models/EmployerModel");
const { parseSalary } = require("../utils/parsedSaleryForJob");

// Create a new job by the employer
exports.createJobByEmployer = asyncHandler(async (req, res, next) => {
  const {
    jobTitle,
    jobDescription,
    dueDate,
    jobCity,
    jobRequirements,
    jobField,
    jobType,
    jobSalary,
  } = req.body;
  const parsedSalary = parseSalary(jobSalary);
  if (parsedSalary === null) {
    return next(new AppError(400, "Invalid salary format."));
  }
  // Create the job
  const newJob = await Job.create({
    author: req.employer._id,
    jobTitle,
    jobDescription,
    dueDate: new Date(dueDate),
    jobCity,
    jobRequirements,
    jobField,
    jobType,
    jobSalary: parsedSalary,
  });
  if (!newJob) {
    return next(new AppError(403, "Failed to create the job."));
  }
  // Find users whose profession matches the job requirements
  const matchingUsers = await User.find({
    profession: { $in: jobField },
  });

  matchingUsers.map(async (user) => {
    const notifications = {
      employerId: req.body.author,
      message: `פורסמה משרת פיתוח שמתאימה לך חפש ${jobTitle}`,
    };
    user.notifications.push(notifications);
    await user.save();
  });

  // Respond with the new job and updated employer info
  res.status(200).json({
    status: "success",
    job: newJob,
    employer: await Employer.findById(req.employer._id).populate("jobs"),
  });
});

// Get all jobs
exports.getAllJobs = asyncHandler(async (req, res, next) => {
  const { jobField, jobTitle, jobCity, jobType, generalSearch, filters } =
    req.query;

  let filter = {};

  if (jobCity) {
    jobCity = jobCity.replace(/\s/g, "\\s");
    filter.jobCity = { $regex: jobCity, $options: "i" };
  }

  // If general search is activated
  if (generalSearch && filters) {
    try {
      const parsedFilters = JSON.parse(filters); // Ensure filters are parsed correctly

      // Add parsed filters to the main filter
      filter = { ...filter, ...parsedFilters };
    } catch (error) {
      console.error("Error parsing filters:", error);
      return res
        .status(400)
        .json({ status: "error", message: "Invalid filters" });
    }
  } else {
    // Individual filters based on specific job attributes
    if (jobField) filter.jobField = { $regex: jobField, $options: "i" };
    if (jobTitle) filter.jobTitle = { $regex: jobTitle, $options: "i" };
    if (jobCity) filter.jobCity = { $regex: jobCity, $options: "i" };
    if (jobType) filter.jobType = jobType; // Assuming jobType doesn't need regex
  }

  // If no specific filters are provided, return an error message
  if (Object.keys(filter).length === 0) {
    return res
      .status(400)
      .json({ status: "error", message: "No search criteria provided" });
  }

  try {
    const jobs = await Job.find(filter);
    res.json({ status: "success", data: jobs });
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ status: "error", message: "Failed to fetch jobs" });
  }
});

// Delete a job by the employer
exports.deleteJobByEmployer = asyncHandler(async (req, res, next) => {
  const job = await Job.findByIdAndDelete(req.params.id);
  if (!job) {
    return next(new AppError(404, "No job found with that ID"));
  }
  const employer = await Employer.findById(job.author);
  job.candidates.map(async (candidate) => {
    const user = await User.findById(candidate.user);
    const notifications = {
      userId: user._id,
      message: `${employer.companyName} הפך את המשרה :${job.jobTitle} ללא רלוונטית `,
    };
    user.notifications.push(notifications);
    await user.save();
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Update a job's details
exports.patchJob = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const job = await Job.findByIdAndUpdate(_id, req.body);

  if (!job) {
    return next(new AppError(404, "Job not found"));
  }

  res.status(200).json({
    status: "success",
    data: job,
  });
});

// Search for jobs based on various filters
exports.searchJobs = asyncHandler(async (req, res) => {
  const { jobField, jobTitle, location, jobType, generalSearch } = req.body;

  let query = {};
  if (jobField) query.jobField = { $regex: jobField, $options: "i" };
  if (jobTitle) query.jobTitle = { $regex: jobTitle, $options: "i" };
  if (location) query.jobCity = { $regex: location, $options: "i" };
  if (jobType) query.jobType = jobType;

  if (generalSearch) {
    query = {
      $or: [
        { jobField: { $regex: generalSearch, $options: "i" } },
        { jobTitle: { $regex: generalSearch, $options: "i" } },
        { jobCity: { $regex: generalSearch, $options: "i" } },
      ],
    };
  }

  const jobs = await Job.find(query);
  res.status(200).json({
    status: "success",
    jobs,
  });
});

// Get jobs created by the employer
exports.getEmployerJobs = asyncHandler(async (req, res) => {
  const employerId = req.employer.id;
  const jobs = await Job.find({ author: employerId });

  res.status(200).json({
    status: "success",
    data: {
      jobs,
    },
  });
});

// Update the status of a job candidate
exports.updateJobCandidateStatus = asyncHandler(async (req, res) => {
  const { jobId, userId, status } = req.body;

  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  const candidateIndex = job.candidates.findIndex(
    (candidate) => candidate.user.toString() === userId
  );

  if (candidateIndex !== -1) {
    job.candidates[candidateIndex].status = status;
  } else {
    job.candidates.push({ user: userId, status });
  }
  await job.save();
  const user = await User.findById(userId);
  const notifications = {
    employerId: job.author,
    message: `הסטטוס שלך למשרה ${job.jobTitle} התעדכן ל${status}`,
  };
  user.notifications.push(notifications);
  await user.save();

  res.status(200).json({ message: "Candidate status updated successfully" });
});

// Get jobs along with candidate details for the employer
exports.getEmployerJobsWithCandidates = asyncHandler(async (req, res) => {
  const employerId = req.user._id;

  const jobs = await Job.find({ author: employerId }).populate(
    "candidates.user",
    "firstName lastName phoneNumber cvUrl"
  );

  if (!jobs) {
    return res.status(404).json({ message: "No jobs found for this employer" });
  }

  res.status(200).json({
    status: "success",
    data: {
      jobs,
    },
  });
});

// Apply for a job as a candidate
exports.applyToJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const userId = req.user._id;
  const { coverLetter } = req.body;

  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const alreadyApplied = job.candidates.some(
    (candidate) => candidate.user.toString() === userId.toString()
  );

  if (alreadyApplied) {
    return res
      .status(400)
      .json({ message: "You have already applied for this job" });
  }

  job.candidates.push({
    user: user._id,
    status: "pending",
    coverLetter: coverLetter || "",
  });

  await job.save();
  const employer = await Employer.findById(job.author);
  const notifications = {
    employerId: job.author,
    message: `${user.firstName} ${user.lastName} הגיש למשרת ${job.jobTitle} `,
  };
  employer.notifications.push(notifications);
  await employer.save();

  res.status(200).json({
    status: "success",
    data: {
      job,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        cvUrl: user.cvUrl,
        coverLetter: coverLetter || "",
      },
    },
  });
});

// Get a job by its ID
exports.getJobById = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId).populate("candidates.user");
  if (!job) {
    return res.status(404).json({
      status: "error",
      message: "Job not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      job,
    },
  });
});

// Delete a job application by the candidate
exports.deleteJobApplication = asyncHandler(async (req, res) => {
  const { jobId, userId } = req.params;

  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  job.candidates = job.candidates.filter(
    (candidate) => candidate.user.toString() !== userId
  );

  await job.save();

  res.status(200).json({ message: "Job application deleted successfully" });
});

// Get filtered job candidates for a specific job
exports.getFilteredJobCandidates = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const { status } = req.query;

  const job = await Job.findById(jobId).populate({
    path: "candidates.user",
    select: "firstName lastName phoneNumber cvUrl",
  });

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  const filteredCandidates = job.candidates.filter(
    (candidate) => !status || candidate.status === status
  );

  res.status(200).json({
    status: "success",
    data: {
      candidates: filteredCandidates,
    },
  });
});

// Get jobs applied by a specific candidate
exports.getJobsForCandidate = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const jobs = await Job.find({ "candidates.user": userId });
  res.json(jobs);
});

// Get a random selection of jobs
// exports.getRandomJobs = asyncHandler(async (req, res, next) => {
//   const jobs = await Job.aggregate([{ $sample: { size: 3 } }]);
//   if (!jobs) return next(new AppError(404, "No jobs were found"));

//   res.status(200).json({
//     status: "success",
//     results: jobs.length,
//     data: jobs,
//   });
// });

exports.getRandomJobs = asyncHandler(async (req, res, next) => {
  // Fetch random jobs
  let jobs = await Job.aggregate([{ $sample: { size: 5 } }]);
  if (!jobs)
    return next(new AppError(500, "An error occurred while fetching jobs"));

  const uniqueJobs = [];
  const seenIds = new Set();

  for (const job of jobs) {
    if (!seenIds.has(job._id.toString())) {
      uniqueJobs.push(job);
      seenIds.add(job._id.toString());
    }
    // Stop once we have 3 unique jobs
    if (uniqueJobs.length === 3) break;
  }

  // Handle if fewer than 3 unique jobs are found
  if (uniqueJobs.length < 3)
    return next(new AppError(404, "Not enough unique jobs found"));

  // Return the random unique jobs
  res.status(200).json({
    status: "success",
    results: uniqueJobs.length,
    data: uniqueJobs,
  });
});

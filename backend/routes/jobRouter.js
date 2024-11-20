const jobsController = require("../controllers/jobsController");
const authForJob = require("../controllers/authForJob");
const authController = require("../controllers/authController");
const express = require("express");
const uploadCvController = require("../controllers/uploadCvController");
const router = express.Router();

router.get("/random-jobs", jobsController.getRandomJobs);
router.route("/getAllJobs").get(jobsController.getAllJobs);

router.post(
  "/createJobByEmployer",
  authForJob.protectJob,
  jobsController.createJobByEmployer
);
router.post("/search", jobsController.searchJobs);
router.route("/deleteJob/:id").delete(jobsController.deleteJobByEmployer);

router.route("/editJobByEmployer/:_id").patch(jobsController.patchJob);
router
  .route("/updateCandidateStatus")
  .patch(jobsController.updateJobCandidateStatus);
router.route("/getJobById/:jobId").get(jobsController.getJobById);
router.get(
  "/jobs/getEmployerJobsWithCandidates",
  jobsController.getEmployerJobsWithCandidates
);

router
  .route("/jobs/:jobId/candidates")
  .get(jobsController.getFilteredJobCandidates);
router.get("/jobs-for-candidate/:userId", jobsController.getJobsForCandidate);
router
  .route("/applyToJob/:jobId")
  .post(authController.protect, jobsController.applyToJob);
router
  .route("/getEmployerJobs")
  .get(authForJob.protectJob, jobsController.getEmployerJobs);
router.delete(
  "/:jobId/applications/:userId",
  authController.protect,
  jobsController.deleteJobApplication
);

module.exports = router;

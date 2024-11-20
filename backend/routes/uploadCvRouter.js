const express = require("express");
const authController = require("../controllers/authController"); // Ensure this middleware is working
const router = express.Router();
const multer = require("multer");
const UploadCvController = require("../controllers/uploadCvController");
const authForCv = require("../controllers/authForCv");

const upload = multer({
  dest: "uploads/cvs/", // Directory to store CVs
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    // Only accept PDF and DOCX files
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only .pdf and .docx files are allowed."));
    }
    cb(null, true);
  },
});

router.post("/uploadCv", authForCv.protect, UploadCvController.uploadCv);
router
  .route("/getUserCvs")
  .get(authForCv.protect, UploadCvController.getUserCVs);
router
  .route("/deleteCv/:id")
  .delete(authForCv.protect, UploadCvController.deleteCv);
router
  .route("/downloadCv/:fileName")
  .get(authForCv.protect, UploadCvController.downloadCv);

module.exports = router;

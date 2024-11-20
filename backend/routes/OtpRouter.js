const express = require("express");
const OTPController = require("../controllers/OTPController");
const authController = require("../controllers/authController");

const router = express.Router();

// route for user OTP
router.post(
  "/sendOtp",
  authController.protect,
  OTPController.sendOtpForPasswordChange
);

router.post(
  "/verifyOtpAndChangePassword",
  authController.protect,
  OTPController.verifyOtpAndChangePassword
);
router
  .route("/sendOtpForEmailChange")
  .post(authController.protect, OTPController.sendOtpForEmailChange);

router
  .route("/verifyOtpAndChangeEmail")
  .post(authController.protect, OTPController.verifyOtpAndChangeEmail);

// route for employer OTP
router.post(
  "/sendOtpEmployer",
  authController.protect,
  OTPController.sendOtpForPasswordChangeEmployer
);

router.post(
  "/verifyOtpAndChangePasswordEmployer",
  authController.protect,
  OTPController.verifyOtpAndChangePasswordEmployer
);
router
  .route("/sendOtpForEmailChangeEmployer")
  .post(authController.protect, OTPController.sendOtpForEmailChangeEmployer);

router
  .route("/verifyOtpAndChangeEmailEmployer")
  .post(authController.protect, OTPController.verifyOtpAndChangeEmailEmployer);

module.exports = router;

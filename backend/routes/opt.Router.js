const express = require("express");
const { sendOtp, validateOtp } = require("../controllers/optController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.post("/sendOtp", protect, sendOtp);
router.post("/validateOtp", validateOtp);

module.exports = router;

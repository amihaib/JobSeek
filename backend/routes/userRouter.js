const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const jobsController = require("../controllers/jobsController");
const express = require("express");
const router = express.Router();

router.route("/register").post(authController.createUser);
router.route("/login").post(authController.login);
router.route("/logOut").get(authController.logOut);
router
  .route("/notifications")
  .get(authController.protect, userController.getNotifications);

router
  .route("/deleteNotifications")
  .delete(authController.protect, userController.deleteNotifications);

router.patch(
  "/notifications/read/:notificationId",
  authController.protect,
  userController.markNotificationAsRead
);

router
  .route("/updateProfilePicture")
  .put(authController.protect, userController.updateProfilePicture);

router
  .route("/getProfileNameAndLastName")
  .get(authController.protect, userController.getProfileNameAndLastName);

// Mine
router.get("/getUser", authController.protect, userController.getUserById);

router.get("/me", authController.protect, userController.getUserDetails);

router.route("/getUsers").post(userController.getUsers);
router
  .route("/getUserCv")
  .post(authController.protect, userController.getUserCv);
router
  .route("/apply/:jobId")
  .post(authController.protect, jobsController.applyToJob);
// Mine
router
  .route("/updateUser")
  .patch(authController.protect, userController.updateUserProfile);

// Mine
router.get(
  "/validateToken",
  authController.protect,
  authController.validateToken
);
router.patch(
  "/:userId/rate",

  authController.protect,
  userController.updateRanking
);
router.get("/:userId/ratings", userController.getCandidateRatings);

router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword/:plainResetToken", authController.resetPassword);

module.exports = router;

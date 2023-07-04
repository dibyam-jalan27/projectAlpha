const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updateProfile,
  updatePassword,
  updateVerdict
} = require("../Controllers/userController");
const { isAuthenticatedUser } = require("../middleware/auth");
const router = express.Router();

//routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(isAuthenticatedUser, logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticatedUser,getUserDetails);
router.route("/me/update").put(isAuthenticatedUser,updateProfile);
router.route("/password/update").put(isAuthenticatedUser,updatePassword);
router.route("/updateVerdict").put(isAuthenticatedUser,updateVerdict);

module.exports = router;

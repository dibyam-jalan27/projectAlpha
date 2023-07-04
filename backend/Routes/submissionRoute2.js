const express = require("express");
const {
  getSubmissions,
  addSubmission,
} = require("../Controllers/submittionController");
const router = express.Router();
const { authorizeRoles, isAuthenticatedUser } = require("../middleware/auth");

router.route(`/submission/user/:id`).get(getSubmissions);
router.route(`/submission/user/:id`).post(addSubmission);

module.exports = router;

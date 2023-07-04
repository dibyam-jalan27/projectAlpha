const express = require("express");
const {
  getProblems,
  getSingleProblem,
  newProblem,
  updateProblem,
  deleteProblem,
  updateCount,
} = require("../Controllers/problemController");
const router = express.Router();
const { authorizeRoles, isAuthenticatedUser } = require("../middleware/auth");

//routes
router.route("/problems").get(getProblems);
router.route("/problem/:id").put(updateCount);
router
  .route("/admin/problem/:id")
  .put(updateProblem)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProblem);
router.route("/problem/:id").get(getSingleProblem);
router
  .route("/admin/problem/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newProblem);

module.exports = router;

const express = require("express");
const {
  getProblems,
  getSingleProblem,
  newProblem,
  updateProblem,
  deleteProblem,
} = require("../Controllers/problemController");
const router = express.Router();
const { authorizeRoles, isAuthenticatedUser } = require("../middleware/auth");

//routes
router.route("/problems").post(getProblems);
router
  .route("/admin/problem/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProblem)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProblem);
router.route("/problem/:id").get(getSingleProblem);
router
  .route("/admin/problem/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newProblem);

module.exports = router;

const express = require('express');
const router = express.Router();
const { authorizeRoles, isAuthenticatedUser } = require("../middleware/auth");
const { getSingleTestCase, newTestCase } = require('../Controllers/testCaseController');

router.route('/testcase/get').get(isAuthenticatedUser,getSingleTestCase);
router.route('/admin/testcase/new').post(isAuthenticatedUser,authorizeRoles("admin"),newTestCase);

module.exports = router;
const express = require('express')
const { runCode, submitCode } = require('../Controllers/submittionController')
const router = express.Router()

router.route('/run').post(runCode);
router.route('/submit').post(submitCode);

module.exports = router;
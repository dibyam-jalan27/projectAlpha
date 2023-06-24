const express = require('express')
const { compileCode, submitCode } = require('../Controllers/submittionController')
const router = express.Router()

router.route('/compile').post(compileCode);
router.route('/submit').post(submitCode);

module.exports = router;
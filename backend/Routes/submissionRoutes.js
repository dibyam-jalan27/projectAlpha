const express = require('express')
const { compileCode } = require('../Controllers/submittionController')
const router = express.Router()

router.route('/compile').post(compileCode);

module.exports = router;
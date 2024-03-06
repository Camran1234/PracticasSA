const express = require('express');
const router = express.Router();
const mixedOptions = require('../controllers/mixedController');

/** Todo con emergencias */

router.get('/mixed', mixedOptions.calculate);

module.exports = router;
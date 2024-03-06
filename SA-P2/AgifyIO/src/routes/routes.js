const express = require('express');
const router = express.Router();
const agifyOptions = require('../controllers/agifyController');

/** Todo con emergencias */

router.get('/agify', agifyOptions.calculateAge);

module.exports = router;
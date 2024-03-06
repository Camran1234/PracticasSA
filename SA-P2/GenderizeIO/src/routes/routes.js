const express = require('express');
const router = express.Router();
const genderizeOptions = require('../controllers/genderizeController');

/** Todo con emergencias */

router.get('/genderize', genderizeOptions.calculateGender);

module.exports = router;
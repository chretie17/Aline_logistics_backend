const express = require('express');
const surveyController = require('../controllers/surveyController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth(['client']), surveyController.createSurvey);
router.get('/', auth(['admin']), surveyController.getAllSurveys);

module.exports = router;

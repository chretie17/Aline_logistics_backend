const express = require('express');
const feedbackController = require('../controllers/feedbackController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth(['client']), feedbackController.createFeedback);
router.get('/', auth(['admin']), feedbackController.getAllFeedback);

module.exports = router;

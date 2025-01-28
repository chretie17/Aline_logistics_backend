const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedback, getOrderFeedback } = require('../controllers/feedbackController');

// POST: Submit feedback (Only order ID needed)
router.post('/', submitFeedback);

// GET: Get all feedback
router.get('/', getAllFeedback);

// GET: Get feedback by order ID
router.get('/order/:orderId', getOrderFeedback);

module.exports = router;

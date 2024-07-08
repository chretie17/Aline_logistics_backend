const express = require('express');
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth(['client']), orderController.createOrder);
router.get('/', auth(['client', 'admin']), orderController.getAllOrders);

module.exports = router;

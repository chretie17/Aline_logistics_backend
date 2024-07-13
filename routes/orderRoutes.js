const express = require('express');
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth(['client', 'admin']), orderController.createOrder);

module.exports = router;

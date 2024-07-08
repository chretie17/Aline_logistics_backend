const express = require('express');
const saleController = require('../controllers/saleController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth(['stockManager']), saleController.createSale);
router.get('/', auth(['stockManager', 'admin']), saleController.getAllSales);

module.exports = router;

const express = require('express');
const stockController = require('../controllers/stockController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth(['stockManager', 'admin']), stockController.getAllStocks);
router.post('/', auth(['stockManager']), stockController.createStock);

module.exports = router;

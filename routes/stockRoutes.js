const express = require('express');
const stockController = require('../controllers/stockController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth(['stockManager', 'admin','client']), stockController.getAllStocks);
router.post('/', auth(['stockManager']), stockController.createStock);
router.put('/:id', auth(['stockManager']), stockController.updateStock);
router.delete('/:id', auth(['stockManager']), stockController.deleteStock);

module.exports = router;

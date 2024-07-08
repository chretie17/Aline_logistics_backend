const express = require('express');
const purchaseController = require('../controllers/purchaseController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth(['stockManager']), purchaseController.createPurchase);
router.get('/', auth(['stockManager', 'admin']), purchaseController.getAllPurchases);

module.exports = router;

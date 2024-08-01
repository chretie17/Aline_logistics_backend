// routes/stockManagerRawRoutes.js

const express = require('express');
const router = express.Router();
const stockManagerRawController = require('../controllers/StockDashController');
const auth = require('../middleware/auth');

router.get('/products', auth(['stockManager', 'admin']), stockManagerRawController.getProducts);
router.get('/products/low-stock', auth(['stockManager', 'admin']), stockManagerRawController.getLowStockProducts);
router.get('/orders/pending', auth(['stockManager', 'admin']), stockManagerRawController.getPendingOrders);
router.put('/orders/:orderId/status', auth(['stockManager', 'admin']), stockManagerRawController.updateOrderStatus);

module.exports = router;

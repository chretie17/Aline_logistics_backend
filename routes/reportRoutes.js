const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');

// Stock reports
router.get('/stock/value', reportsController.getTotalStockValue);
router.get('/stock/category', reportsController.getStockByCategory);

// Order reports
router.get('/orders/status-count', reportsController.getOrderStatusCounts);
router.get('/orders/today', reportsController.getOrdersToday);
router.get('/orders/monthly', reportsController.getMonthlyOrders);

// Driver performance
router.get('/drivers/performance', reportsController.getDriverPerformance);

module.exports = router;

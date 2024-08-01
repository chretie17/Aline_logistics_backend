const express = require('express');
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth(['stockManager', 'admin']), orderController.getAllOrders);
router.post('/', auth(['client']), orderController.createOrder);
router.put('/:id', auth(['stockManager', 'admin']), orderController.updateOrderStatus); 
router.get('/client/:userId', auth(['client']), orderController.getClientOrders);
router.get('/user/:userId', auth(['client', 'admin']), orderController.getOrdersByUser);
router.put('/cancel/:id', auth(['client', 'admin']), orderController.cancelOrder);
router.put('/:id/status', auth(['stockManager', 'admin','client']), orderController.updateOrderStatus);
router.put('/:id/assign', auth(['stockManager', 'admin']), orderController.assignOrderToDriver);
router.get('/driver/:driverId', auth(['driver']), orderController.getOrdersByDriver);
router.get('/:id', orderController.getOrderDetails);
router.delete('/:id', orderController.deleteOrder);  // Ensure this line exists
router.get('/orders/user/:userId', orderController.getOrdersByUser);
router.get('/today;', orderController.getOrdersToday);
router.get('/statuscount;', orderController.getOrderStatusCounts);

router.put('/orders/cancel/:orderId', orderController.cancelOrder);


module.exports = router;

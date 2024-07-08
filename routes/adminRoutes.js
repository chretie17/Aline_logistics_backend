const express = require('express');
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const router = express.Router();

// Users CRUD
router.get('/users', auth(['admin']), adminController.getAllUsers);
router.post('/users', auth(['admin']), adminController.createUser);
router.put('/users/:id', auth(['admin']), adminController.updateUser);
router.delete('/users/:id', auth(['admin']), adminController.deleteUser);

// Orders CRUD
router.get('/orders', auth(['admin']), adminController.getAllOrders);
router.post('/orders', auth(['admin']), adminController.createOrder);
router.put('/orders/:id', auth(['admin']), adminController.updateOrder);
router.delete('/orders/:id', auth(['admin']), adminController.deleteOrder);

// Transports CRUD
router.get('/transports', auth(['admin']), adminController.getAllTransports);
router.post('/transports', auth(['admin']), adminController.createTransport);
router.put('/transports/:id', auth(['admin']), adminController.updateTransport);
router.delete('/transports/:id', auth(['admin']), adminController.deleteTransport);

router.get('/reports', auth(['admin']), adminController.getReports);

module.exports = router;

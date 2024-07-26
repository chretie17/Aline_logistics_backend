const express = require('express');
const transportController = require('../controllers/transportController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth(['driver', 'admin']), transportController.getAllTransports);
router.post('/', auth(['admin']), transportController.createTransport);


module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');


const { getAllDrivers } = require('../controllers/DriverController');

router.get('/', auth(['stockManager', 'admin']), getAllDrivers);

module.exports = router;

const { Driver } = require('../models');

exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.findAll();
    res.json(drivers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

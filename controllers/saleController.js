const Sale = require('../models').Sale;

exports.createSale = async (req, res) => {
  try {
    const sale = await Sale.create(req.body);
    res.status(201).json({ message: 'Sale recorded', sale });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.findAll();
    res.json(sales);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const Stock = require('../models').Stock;

exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.findAll();
    res.json(stocks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createStock = async (req, res) => {
  try {
    const stock = await Stock.create(req.body);
    res.status(201).json({ message: 'Stock added', stock });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

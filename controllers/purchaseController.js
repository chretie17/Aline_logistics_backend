const Purchase = require('../models').Purchase;

exports.createPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.create(req.body);
    res.status(201).json({ message: 'Purchase recorded', purchase });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.findAll();
    res.json(purchases);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

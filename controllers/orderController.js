const Order = require('../models').Order;
const Stock = require('../models').Stock;

exports.createOrder = async (req, res) => {
  try {
    const { productId, quantity, userId } = req.body;
    const stock = await Stock.findByPk(productId);

    if (!stock) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (stock.inStock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    await stock.update({ inStock: stock.inStock - quantity });

    const order = await Order.create({ productId, quantity, userId });
    res.status(201).json({ message: 'Order created', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

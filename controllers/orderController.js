const Order = require('../models').Order;

exports.createOrder = async (req, res) => {
  try {
    const order = await Order.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ message: 'Order created', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll(req.user.role === 'client' ? { where: { userId: req.user.id } } : {});
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

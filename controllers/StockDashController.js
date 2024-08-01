const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

const getProducts = async (req, res) => {
  try {
    const products = await sequelize.query(
      'SELECT * FROM Stocks',
      { type: QueryTypes.SELECT }
    );
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to retrieve products', error });
  }
};

const getLowStockProducts = async (req, res) => {
    const { threshold = 10 } = req.query; // Default threshold set to 10
    try {
      const lowStockProducts = await sequelize.query(
        'SELECT * FROM Stocks WHERE inStock < ?',
        { replacements: [threshold], type: QueryTypes.SELECT }
      );
      res.json(lowStockProducts);
    } catch (error) {
      console.error('Error fetching low-stock products:', error);
      res.status(500).json({ message: 'Failed to retrieve low stock products', error });
    }
  };
  
const getPendingOrders = async (req, res) => {
    try {
      const pendingOrders = await sequelize.query(
        `SELECT o.id, o.status, u.name AS user_name, p.name AS product_name, o.quantity
         FROM Orders o
         JOIN Users u ON o.userId = u.id
         JOIN Stocks p ON o.productId = p.id
         WHERE o.status = 'Order Created'`,
        { type: QueryTypes.SELECT }
      );
      res.json(pendingOrders);
    } catch (error) {
      console.error('Error fetching pending orders:', error);
      res.status(500).json({ message: 'Failed to retrieve pending orders', error });
    }
  };
  
const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  try {
    const [result] = await sequelize.query(
      'UPDATE Orders SET status = ? WHERE order_id = ?',
      { replacements: [status, orderId], type: QueryTypes.UPDATE }
    );
    if (result === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status', error });
  }
};

module.exports = {
  getProducts,
  getLowStockProducts,
  getPendingOrders,
  updateOrderStatus,
};

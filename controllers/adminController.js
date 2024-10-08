const User = require('../models').User;
const Order = require('../models').Order;
const Stock = require('../models').Stock;
const Transport = require('../models').Transport;
const bcrypt = require('bcryptjs');
const { sequelize } = require('../models');


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const { id } = req.params;
  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const updates = { name, email, role };
    if (hashedPassword) {
      updates.password = hashedPassword;
    }
    await User.update(updates, { where: { id } });
    const updatedUser = await User.findByPk(id);
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.destroy({ where: { id } });
    res.status(204).json({ message: 'User deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add other methods similarly

// Order CRUD operations
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    await order.update(req.body);
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    await order.destroy();
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Transport CRUD operations
exports.getAllTransports = async (req, res) => {
  try {
    const transports = await Transport.findAll();
    res.json(transports);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createTransport = async (req, res) => {
  try {
    const transport = await Transport.create(req.body);
    res.json(transport);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateTransport = async (req, res) => {
  try {
    const transport = await Transport.findByPk(req.params.id);
    if (!transport) {
      return res.status(404).json({ error: 'Transport not found' });
    }
    await transport.update(req.body);
    res.json(transport);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTransport = async (req, res) => {
  try {
    const transport = await Transport.findByPk(req.params.id);
    if (!transport) {
      return res.status(404).json({ error: 'Transport not found' });
    }
    await transport.destroy();
    res.json({ message: 'Transport deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Reports

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: Stock, as: 'product' },
        { model: User, as: 'user' }
      ]
    });
    res.json({ data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Stock
exports.getStock = async (req, res) => {
  try {
    const stock = await Stock.findAll();
    res.json({ data: stock });
  } catch (error) {
    console.error('Error fetching stock:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getDashboardData = async (req, res) => {
  try {
    const totalOrders = await Order.count();
    const totalStock = await Stock.count('In-Stock');

    res.json({ totalOrders, totalStock });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getCompletedDeliveries = async (req, res) => {
  try {
    console.log('Fetching completed deliveries...');
    const [deliveries] = await sequelize.query(
      `SELECT Orders.id, Orders.status, Orders.deliveryAddress, Orders.deliveryLatitude, Orders.deliveryLongitude, 
              Users.name AS driverName, Orders.updatedAt AS deliveryDate
       FROM Orders 
       INNER JOIN Users ON Orders.driverId = Users.id
       WHERE Orders.status = 'Order Delivered'
       ORDER BY Orders.updatedAt DESC`
    );
    console.log('Completed deliveries:', deliveries);
    res.json({ data: deliveries });
  } catch (error) {
    console.error('Error fetching completed deliveries:', error);
    res.status(500).json({ error: error.message });
  }
};

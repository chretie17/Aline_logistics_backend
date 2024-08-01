const { Order, Stock, User } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../models'); // Import Sequelize instance for executing raw queries

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
    const { userId, productId, quantity } = req.body;
    const order = await Order.create({
      userId,
      productId,
      quantity,
      status: 'Order Created',
      createdAt: new Date(),
    });
    res.status(201).json({ message: 'Order created', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getClientOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.findAll({ where: { userId } });
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: {
        model: Stock,
        as: 'product',
      },
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.product && order.product.image) {
      order.product.image = `data:${order.product.image.mimetype};base64,${order.product.image.toString('base64')}`;
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;

    // Set timestamp for status changes
    if (status === 'Order Created') {
      order.createdAt = new Date();
    } else if (status === 'Order Accepted') {
      order.orderAcceptedAt = new Date();
    } else if (status === 'Order Packed') {
      order.orderPackedAt = new Date();
    } else if (status === 'Order Shipped') {
      order.orderShippedAt = new Date();
    } else if (status === 'Order Delivered') {
      order.orderDeliveredAt = new Date();
    }

    await order.save();
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.userId; // Get userId from the path parameter
    const orders = await Order.findAll({ where: { userId } });
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'Cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }

    order.status = 'Cancelled';
    await order.save();

    res.json({ message: 'Order cancelled', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;

    // Set timestamp for status changes
    if (status === 'Order Accepted') {
      order.orderAcceptedAt = new Date();
    } else if (status === 'Order Packed') {
      order.orderPackedAt = new Date();
    } else if (status === 'Order Shipped') {
      order.orderShippedAt = new Date();
    } else if (status === 'Order Delivered') {
      order.orderDeliveredAt = new Date();
    }

    await order.save();
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.assignOrderToDriver = async (req, res) => {
  try {
    const { driverId } = req.body;
    const orderId = req.params.id;

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.driverId = driverId;
    order.driverAssigned = true; // Mark as driver assigned
    await order.save();

    res.json({ message: 'Order assigned to driver', order });
  } catch (error) {
    console.error('Error assigning order to driver:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.assignOrderToDriver = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.driverId = req.body.driverId;
    await order.save();
    res.json({ message: 'Order assigned to driver', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getOrdersByDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    const orders = await Order.findAll({
      where: { driverId, status: { [Op.ne]: 'Order Delivered' } }, // Exclude delivered orders
      include: [{ model: Stock, as: 'product' }],
    });
    res.json({ data: orders });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  console.log('DELETE /orders/:id endpoint hit');
  try {
    const orderId = req.params.id;
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    await order.destroy();
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.findAll({
      where: { userId },
      include: [
        { model: Stock, as: 'product' },
        { model: User, as: 'user' }
      ]
    });
    res.json({ data: orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderStatusCounts = async (req, res) => {
  try {
    const statusCounts = await Order.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'count']],
      group: 'status',
    });

    res.json({ data: statusCounts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getOrdersToday = async (req, res) => {
  try {
    // Get the start and end of the current day
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); // Set to the start of the day

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999); // Set to the end of the day

    // Query the orders created today
    const ordersToday = await Order.findAll({
      where: {
        createdAt: {
          [Op.between]: [startOfToday, endOfToday],
        },
      },
    });

    res.json({ data: ordersToday });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.markOrderAsDelivered = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'Order Delivered') {
      return res.status(400).json({ message: 'Order is already marked as delivered' });
    }

    order.status = 'Order Delivered';
    order.orderDeliveredAt = new Date(); // Timestamp for delivery
    await order.save();

    res.json({ message: 'Order marked as delivered', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const { Order, Stock, User } = require('../models');

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
    const orders = await Order.findAll({ where: { driverId } });
    res.json(orders);
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


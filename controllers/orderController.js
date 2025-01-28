const { Order, Stock, User } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../models'); // Import Sequelize instance for executing raw queries
const { sendEmail } = require('./emailservice');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getAllNEWOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User, // Include user details
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone'], // Select fields to return
        },
      ],
    });
    res.json({ data: orders });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const {
      userId,
      productId,
      quantity,
      deliveryLatitude,
      deliveryLongitude,
      deliveryAddress,
      paymentMethod,
    } = req.body;

    // Find the product in the Stock table
    const product = await Stock.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found in inventory' });
    }

    // Check if there is enough stock
    if (product.inStock < quantity) { // Change `product.quantity` to match your column name
      return res.status(400).json({ message: 'Insufficient stock for this product' });
    }

    // Deduct the quantity from the inventory
    product.inStock -= quantity; // Update this field to match your database column for stock
    await product.save();

    // Create the order
    const order = await Order.create({
      userId,
      productId,
      quantity,
      status: 'Order Created',
      createdAt: new Date(),
      deliveryLatitude,
      deliveryLongitude,
      deliveryAddress,
      paymentMethod,
    });

    res.status(201).json({ message: 'Order created and inventory updated', order });
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
    const order = await Order.findByPk(req.params.id, {
      include: { model: User, as: 'user', attributes: ['email', 'name'] },
    });
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

    // Get status-specific color and icon
    const primaryColor = '#0A2647'; // Dark blue primary color
    const statusConfig = {
      'Order Created': { color: '#0A2647', icon: '🛍️' },
      'Order Accepted': { color: '#0A2647', icon: '✅' },
      'Order Packed': { color: '#0A2647', icon: '📦' },
      'Order Shipped': { color: '#0A2647', icon: '🚚' },
      'Order Delivered': { color: '#0A2647', icon: '🎉' }
    };

    const currentStatus = statusConfig[status] || { color: '#0A2647', icon: '📋' };
    
    // Format date with options
    const dateOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };

    const emailSubject = `${currentStatus.icon} Bspecial Business Ltd - Order #${order.id} Status Update`;
    const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Status Update</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f7f7; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: ${primaryColor}; margin: 0; font-size: 32px; font-weight: 700;">Bspecial Business Ltd</h1>
      <div style="width: 50px; height: 4px; background-color: ${primaryColor}; margin: 15px auto;"></div>
      <p style="color: #666666; font-size: 16px; margin-top: 10px;">Excellence in Every Service</p>
    </div>

    <div style="background-color: ${primaryColor}; padding: 25px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
      <h2 style="color: #ffffff; margin: 0; font-size: 24px;">
        ${currentStatus.icon} ${status}
      </h2>
    </div>

    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
      Dear <strong>${order.user.name}</strong>,
    </p>

    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
      Thank you for choosing Bspecial Business Ltd. Here's an update on your order:
    </p>

    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 30px; border: 1px solid #e9ecef;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; color: #666666; font-weight: 600;">Order ID:</td>
          <td style="padding: 12px 0; color: ${primaryColor}; text-align: right; font-weight: bold;">#${order.id}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; color: #666666; font-weight: 600;">Status:</td>
          <td style="padding: 12px 0; color: ${primaryColor}; text-align: right; font-weight: bold;">
            ${currentStatus.icon} ${status}
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; color: #666666; font-weight: 600;">Updated On:</td>
          <td style="padding: 12px 0; color: #333333; text-align: right;">
            ${new Date().toLocaleDateString('en-US', dateOptions)}
          </td>
        </tr>
      </table>
    </div>

    <div style="background-color: #f0f4f8; border-radius: 8px; padding: 20px; margin-bottom: 30px; border-left: 4px solid ${primaryColor};">
      <p style="color: ${primaryColor}; font-size: 16px; line-height: 1.6; margin: 0; font-weight: 600;">
        📌 To track your order, please log in to your account in The system
      </p>
    </div>

    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
      Our team is committed to ensuring your complete satisfaction. If you have any questions or need assistance, please don't hesitate to reach out to our dedicated support team.
    </p>

    <div style="text-align: center; border-top: 1px solid #eeeeee; padding-top: 30px; margin-top: 40px;">
      <p style="color: ${primaryColor}; font-size: 18px; font-weight: 600; margin-bottom: 15px;">
        Contact Information
      </p>
      <p style="color: #666666; font-size: 14px; margin-bottom: 10px;">
        📧 support@bspecial.rw | 📞 +250 788 123 456
      </p>
      <p style="color: #666666; font-size: 14px; margin-bottom: 10px;">
        🏢 KN 5 Road, Kigali Heights, Level 2
      </p>
      <p style="color: #666666; font-size: 14px; margin-bottom: 10px;">
        Kigali, Rwanda
      </p>
      <div style="margin: 20px 0;">
        <span style="display: inline-block; margin: 0 10px; color: ${primaryColor};">●</span>
        <span style="display: inline-block; margin: 0 10px; color: ${primaryColor};">●</span>
        <span style="display: inline-block; margin: 0 10px; color: ${primaryColor};">●</span>
      </div>
      <p style="color: #999999; font-size: 12px; margin-top: 20px;">
        © ${new Date().getFullYear()} Bspecial Business Ltd. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;

    await sendEmail(order.user.email, emailSubject, '', emailBody);
    res.json({ message: 'Order status updated and email sent', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.findAll({
      where: { userId },
      include: [
        { model: Stock, as: 'product' },
        { model: User, as: 'user' }
      ]
    });
    res.json({ data: orders });
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

exports.assignOrderToDriver = async (req, res) => {
  try {
    const { driverId } = req.body;
    const orderId = req.params.id;

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.driverId = driverId;
    order.driverAssigned = true;
    await order.save();

    // Return the updated order state in the response
    res.json({ message: 'Order assigned to driver', order });
  } catch (error) {
    console.error('Error assigning order to driver:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getOrdersByDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    const orders = await Order.findAll({
      where: { driverId, status: { [Op.ne]: 'Order Delivered' } },
      include: [
        {
          model: Stock, // Include stock details if needed
          as: 'product',
        },
        {
          model: User, // Include user details
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone'], // Select specific fields
        },
      ],
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
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

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
    const order = await Order.findByPk(orderId, {
      include: [
        { model: User, as: 'user', attributes: ['email', 'name'] }, // Include user details
      ],
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'Order Delivered') {
      return res.status(400).json({ message: 'Order is already marked as delivered' });
    }

    // Update order status and delivery timestamp
    order.status = 'Order Delivered';
    order.orderDeliveredAt = new Date();
    await order.save();

    // Get status-specific color and icon
    const primaryColor = '#4CAF50'; // Green color for delivered
    const statusIcon = '🎉';

    // Generate Feedback Link
    const feedbackLink = `http://localhost:3001/feedback?orderId=${order.id}`;

    // Format the email
    const emailSubject = `${statusIcon} Bspecial Business Ltd - Order #${order.id} Delivered!`;
    const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Delivered</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f7f7; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: ${primaryColor}; margin: 0; font-size: 32px; font-weight: 700;">Bspecial Business Ltd</h1>
      <div style="width: 50px; height: 4px; background-color: ${primaryColor}; margin: 15px auto;"></div>
      <p style="color: #666666; font-size: 16px; margin-top: 10px;">Excellence in Every Service</p>
    </div>

    <div style="background-color: ${primaryColor}; padding: 25px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
      <h2 style="color: #ffffff; margin: 0; font-size: 24px;">
        ${statusIcon} Order Delivered!
      </h2>
    </div>

    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
      Dear <strong>${order.user.name}</strong>,
    </p>

    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
      We are delighted to inform you that your order <strong>#${order.id}</strong> has been successfully delivered. Thank you for choosing Bspecial Business Ltd!
    </p>

    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 30px; border: 1px solid #e9ecef;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; color: #666666; font-weight: 600;">Order ID:</td>
          <td style="padding: 12px 0; color: ${primaryColor}; text-align: right; font-weight: bold;">#${order.id}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; color: #666666; font-weight: 600;">Status:</td>
          <td style="padding: 12px 0; color: ${primaryColor}; text-align: right; font-weight: bold;">
            ${statusIcon} Delivered
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; color: #666666; font-weight: 600;">Delivered On:</td>
          <td style="padding: 12px 0; color: #333333; text-align: right;">
            ${new Date(order.orderDeliveredAt).toLocaleString()}
          </td>
        </tr>
      </table>
    </div>

    <div style="background-color: #f0f4f8; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
      <p style="color: ${primaryColor}; font-size: 16px; font-weight: 600;">💬 We’d love to hear your feedback!</p>
      <p style="color: #666666; font-size: 14px;">Please take a moment to rate your experience with us.</p>
      <a href="${feedbackLink}" 
         style="background-color: ${primaryColor}; color: white; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold;">
        Give Feedback
      </a>
    </div>

    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
      If you have any questions or need assistance, please feel free to contact us.
    </p>

    <div style="text-align: center; border-top: 1px solid #eeeeee; padding-top: 20px; margin-top: 30px;">
      <p style="color: ${primaryColor}; font-size: 18px; font-weight: 600;">📞 Contact Information</p>
      <p style="color: #666666; font-size: 14px; margin-bottom: 10px;">
        📧 support@bspecial.rw | 📞 +250 788 123 456
      </p>
      <p style="color: #666666; font-size: 14px; margin-bottom: 10px;">
        🏢 KN 5 Road, Kigali Heights, Level 2
      </p>
      <p style="color: #999999; font-size: 12px; margin-top: 20px;">
        © ${new Date().getFullYear()} Bspecial Business Ltd. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`;

    // Send email to the user
    await sendEmail(order.user.email, emailSubject, '', emailBody);

    res.json({ message: 'Order marked as delivered, email with feedback link sent', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

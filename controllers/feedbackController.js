const { Feedback, Order } = require('../models');
const { sequelize } = require('../models'); // Import Sequelize instance


// ✅ 1. Submit Feedback (Only Order ID Required)
exports.submitFeedback = async (req, res) => {
  try {
    const { orderId, rating, comments } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Ensure the order exists
    const orderExists = await Order.findByPk(orderId);
    if (!orderExists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Save feedback
    const feedback = await Feedback.create({ orderId, rating, comments });

    res.status(201).json({ message: 'Thank you for your feedback!', feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ 2. Get All Feedback
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbackQuery = `
      SELECT 
        f.id AS feedbackId,
        f.orderId,
        f.rating,
        f.comments,
        f.createdAt AS feedbackDate,
        o.status AS orderStatus,
        o.createdAt AS orderDate,
        u.name AS customerName,
        u.email AS customerEmail
      FROM Feedback f
      LEFT JOIN Orders o ON f.orderId = o.id
      LEFT JOIN Users u ON o.userId = u.id
      ORDER BY f.createdAt DESC;
    `;

    const [feedbacks] = await sequelize.query(feedbackQuery);

    res.json({ data: feedbacks });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to retrieve feedbacks.' });
  }
};

// ✅ 3. Get Feedback by Order ID (Check if order has feedback)
exports.getOrderFeedback = async (req, res) => {
  try {
    const { orderId } = req.params;

    const orderFeedback = await Feedback.findOne({
      where: { orderId },
      include: [{ model: Order, attributes: ['id', 'status'] }],
    });

    if (!orderFeedback) {
      return res.status(404).json({ message: 'No feedback found for this order' });
    }

    res.json({ data: orderFeedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

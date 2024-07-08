const Feedback = require('../models').Feedback;

exports.createFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ message: 'Feedback submitted', feedback });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll();
    res.json(feedbacks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

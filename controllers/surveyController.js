const Survey = require('../models').Survey;

exports.createSurvey = async (req, res) => {
  try {
    const survey = await Survey.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ message: 'Survey submitted', survey });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllSurveys = async (req, res) => {
  try {
    const surveys = await Survey.findAll();
    res.json(surveys);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

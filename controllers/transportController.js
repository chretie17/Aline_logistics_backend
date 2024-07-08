const Transport = require('../models').Transport;

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
    res.status(201).json({ message: 'Transport added', transport });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const { sequelize } = require('../models');


exports.getAllDrivers = async (req, res) => {
  try {
    // Fetch all users with the role 'driver'
    const [drivers] = await sequelize.query(`
      SELECT id, name FROM Users WHERE role = 'driver'
    `);

    res.json({ data: drivers });
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ error: error.message });
  }
};


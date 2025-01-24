const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models').User;

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password, role, phone } = req.body; // Add phone here
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
  try {
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone, // Include phone here
    });
    res.status(201).json({ message: 'User registered', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password); // Compare passwords
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, role: user.role }, 'secretkey'); // Generate JWT token
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id); // Retrieve user by primary key
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  const { name, phone } = req.body; // Allow updating name and phone
  try {
    const user = await User.findByPk(req.user.id); // Retrieve user by primary key
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.name = name || user.name; // Update name if provided
    user.phone = phone || user.phone; // Update phone if provided

    await user.save(); // Save updated user
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

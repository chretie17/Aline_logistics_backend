// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models').User;

const auth = (roles) => async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, 'secretkey');
    const user = await User.findByPk(decoded.id);
    if (!user || (roles && !roles.includes(user.role))) {
      return res.status(403).send('Forbidden');
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send('Unauthorized');
  }
};

module.exports = auth;

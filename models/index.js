const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('logistics', 'root', 'Admin@123', {
  host: 'localhost',
  dialect: 'mysql',
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./User')(sequelize, DataTypes);
db.Stock = require('./Stock')(sequelize, DataTypes);
db.Order = require('./Order')(sequelize, DataTypes);
db.Transport = require('./Transport')(sequelize, DataTypes);
db.Feedback = require('./Feedback')(sequelize, DataTypes);
db.Survey = require('./Survey')(sequelize, DataTypes);
db.Purchase = require('./Purchase')(sequelize, DataTypes);
db.Sale = require('./Sale')(sequelize, DataTypes);

// Define associations
db.Order.associate(db);
db.Stock.associate(db);

module.exports = db;

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Order Created', // Default status when order is created
    },
    orderAcceptedAt: {
      type: DataTypes.DATE,
    },
    orderPackedAt: {
      type: DataTypes.DATE,
    },
    orderShippedAt: {
      type: DataTypes.DATE,
    },
    orderDeliveredAt: {
      type: DataTypes.DATE,
    },
    driverId: {
      type: DataTypes.INTEGER,
      allowNull: true, 
    },
    driverAssigned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    
  });

  Order.associate = (models) => {
    Order.belongsTo(models.Stock, { foreignKey: 'productId', as: 'product' });
    Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Order;
};

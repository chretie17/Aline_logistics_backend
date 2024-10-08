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
    // New fields for location
    deliveryLatitude: {
      type: DataTypes.DECIMAL(10, 8),  // Latitude has a precision of up to 8 decimal places
      allowNull: true,
    },
    deliveryLongitude: {
      type: DataTypes.DECIMAL(11, 8),  // Longitude has a precision of up to 8 decimal places
      allowNull: true,
    },
    deliveryAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });

  Order.associate = (models) => {
    Order.belongsTo(models.Stock, { foreignKey: 'productId', as: 'product' });
    Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Order;
};

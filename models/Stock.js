module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    upc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    inStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalValue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.BLOB('long'), // Store image as binary data
    },
  });

  Stock.associate = (models) => {
    Stock.hasMany(models.Order, { foreignKey: 'productId', as: 'orders' });
  };

  return Stock;
};

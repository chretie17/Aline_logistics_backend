module.exports = (sequelize, DataTypes) => {
    const Sale = sequelize.define('Sale', {
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    });
    return Sale;
  };
  
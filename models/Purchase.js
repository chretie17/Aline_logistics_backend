module.exports = (sequelize, DataTypes) => {
    const Purchase = sequelize.define('Purchase', {
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
    return Purchase;
  };
  
module.exports = (sequelize, DataTypes) => {
    const Stock = sequelize.define('Stock', {
      name: {
        type: DataTypes.STRING,
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
    return Stock;
  };
  
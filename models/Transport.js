module.exports = (sequelize, DataTypes) => {
    const Transport = sequelize.define('Transport', {
      driverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
    return Transport;
  };
  
module.exports = (sequelize, DataTypes) => {
    const Feedback = sequelize.define('Feedback', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    });
    return Feedback;
  };
  
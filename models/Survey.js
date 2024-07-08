module.exports = (sequelize, DataTypes) => {
    const Survey = sequelize.define('Survey', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      answers: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    });
    return Survey;
  };
  
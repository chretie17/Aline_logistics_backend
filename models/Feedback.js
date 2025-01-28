module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define(
    'Feedback',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5, // Ensure rating is between 1 and 5
        },
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'feedback', // Use the exact table name
      freezeTableName: true, // Prevent Sequelize from pluralizing the table name
      timestamps: false, // Disable updatedAt if not present in your schema
    }
  );

  Feedback.associate = (models) => {
    Feedback.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order',
    });
  };

  return Feedback;
};

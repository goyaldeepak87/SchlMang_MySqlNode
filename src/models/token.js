module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define('Token', {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      // references: {
      //   model: 'Users', // This should match the name of the user model (case-sensitive)
      //   key: 'uuid',
      // },
    },
    type: {
      type: DataTypes.STRING,
    },
    expires: {
      type: DataTypes.DATE,
    },
  });

  Token.associate = (models) => {
    // Token belongs to User
    // Token.belongsTo(models.User, {
    //   foreignKey: 'user_uuid',
    //   targetKey: 'uuid', // Make sure this matches the `User` table's `uuid` field
    // });
    Token.belongsTo(models.User, {
      foreignKey: 'user_uuid',
      constraints: false, // Disable foreign key constraints for polymorphic associations
      scope: {
        user_type: 'User', // Only associate with User when user_type is 'User'
      },
    });

    Token.belongsTo(models.Student, {
      foreignKey: 'user_uuid',
      constraints: false, // Disable foreign key constraints for polymorphic associations
      scope: {
        user_type: 'Student', // Only associate with Student when user_type is 'Student'
      },
    });
  };

  return Token;
};

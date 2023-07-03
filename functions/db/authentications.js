module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define(
    'authenticationBean',
    {
      token: {
        type: DataTypes.STRING,
        field: 'token',
        primaryKey: true,
        allowNull: false,
      },
    },
    {
      tableName: 'authentications',
      timestamps: false,
    }
  );

  model.attributes = ['token'];

  return model;
};

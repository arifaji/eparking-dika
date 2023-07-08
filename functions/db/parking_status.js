module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define(
    'parkingStatusBean',
    {
      id_parking_status: {
        type: DataTypes.STRING,
        field: 'id_parking_status',
        primaryKey: true,
        allowNull: false,
      },
      pool: {
        field: 'pool',
        type: DataTypes.STRING,
        allowNull: true,
      },
      nomor_polisi: {
        field: 'nomor_polisi',
        type: DataTypes.STRING,
        allowNull: true,
      },
      tanggal_masuk: {
        field: 'tanggal_masuk',
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'parking_status',
      timestamps: false,
    }
  );

  model.attributes = [
    'id_parking_status',
    'pool',
    'nomor_polisi',
    'status',
    'tanggal_masuk',
  ];

  return model;
};

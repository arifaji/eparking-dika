module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define(
    'parkingBean',
    {
      id_parking: {
        type: DataTypes.INTEGER,
        field: 'id_parking',
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      jenis_kendaraan: {
        field: 'jenis_kendaraan',
        type: DataTypes.STRING,
        allowNull: true,
      },
      nomor_polisi: {
        field: 'nomor_polisi',
        type: DataTypes.STRING,
        allowNull: true,
      },
      tanggal: {
        field: 'tanggal',
        type: DataTypes.DATE,
        allowNull: true,
      },
      pool: {
        field: 'pool',
        type: DataTypes.STRING,
        allowNull: true,
      },
      tarif: {
        field: 'tarif',
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
      tableName: 'parking',
      timestamps: false,
    }
  );

  model.attributes = [
    'id_parking',
    'jenis_kendaraan',
    'nomor_polisi',
    'tanggal',
    'tarif',
    'pool',
    'tanggal_masuk',
  ];

  return model;
};

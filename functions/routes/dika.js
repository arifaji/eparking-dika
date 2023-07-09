/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
/* eslint-disable guard-for-in */
const moment = require('moment-timezone');
const express = require('express');
const _ = require('lodash');
const querystring = require('querystring');

const {
  sequelize,
  Sequelize,
  parkingBean,
  parkingStatusBean,
} = require('../db');

const { Op, literal } = Sequelize;

const router = express.Router();

router.post('/ubahStatus', async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const param = req.body;
    const dateNow = moment()
      .tz('Asia/Jakarta')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
    const parsedParams = querystring.parse(param.toString());
    console.log(parsedParams);
    const id = _.get(parsedParams, 'id_parking_status', null);
    const pool = _.get(parsedParams, 'pool', '');
    const status = _.get(parsedParams, 'status', '');
    const nopol = _.get(parsedParams, 'nopol', '');

    // const cek = await sequelize.query(
    //   `SELECT id_parking_status FROM parking_status WHERE id_parking_status= '${id}'`,
    //   {
    //     transaction,
    //     type: Sequelize.QueryTypes.SELECT,
    //   }
    // );

    const cek = await parkingStatusBean.findOne({
      where: {
        id_parking_status: id,
      },
      transaction,
    });

    if (!_.isEmpty(cek)) {
      const nomorPolisi = _.get(cek, 'dataValues.nomor_polisi', 'nope');
      const prevPool = _.get(cek, 'dataValues.pool', 'nope');
      await sequelize.query(
        `UPDATE parking_status SET status = '${status}', nomor_polisi='${nomorPolisi}', tanggal_masuk='${dateNow}'  WHERE id_parking_status = '${id}'`,
        {
          transaction,
          type: Sequelize.QueryTypes.UPDATE,
        }
      );
      const prevStatus = _.get(cek, 'dataValues.status', 'nope');
      if (
        prevStatus.toUpperCase() === 'ADA' &&
        status.toUpperCase() === 'TIDAK'
      ) {
        const tanggal_masuk = _.get(cek, 'dataValues.tanggal_masuk', null);
        const jenis_kendaraan = ['a', 'b'].includes(prevPool)
          ? 'Motor'
          : 'Mobil';
        const tarif = jenis_kendaraan.toUpperCase() === 'MOTOR' ? 2000 : 5000;
        await parkingBean.create(
          {
            jenis_kendaraan,
            nomor_polisi: nomorPolisi,
            tarif,
            pool: prevPool,
            tanggal: dateNow,
            tanggal_masuk,
          },
          transaction
        );
      }
    } else {
      await sequelize.query(
        `INSERT INTO parking_status(id_parking_status,pool,nomor_polisi,status, tanggal_masuk) VALUES('${id}','${pool}','${nopol}','${status}', '${dateNow}')`,
        {
          transaction,
          type: Sequelize.QueryTypes.INSERT,
        }
      );
    }
    await transaction.commit();
    res.send({
      success: 1,
      msg: 'Berhasil ubah status!',
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.send({
      success: 0,
      msg: error.message,
    });
  }
});

router.get('/fetchStatus', async (req, res) => {
  try {
    const where = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const key in req.query) {
      const keys = ['id_parking_status', 'pool', 'nopol', 'status'];
      if (keys.includes(key)) where.push(`${key} = '${req.query[key]}'`);
    }
    const data = await sequelize.query(
      `SELECT * FROM parking_status WHERE ${where
        .toString()
        .replace(/,/g, ' AND ')}`,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    const transformedData = _.map(data, (obj) =>
      _.mapKeys(obj, (value, key) => (key === 'nomor_polisi' ? 'nopol' : key))
    );
    res.send({
      success: 1,
      data: transformedData,
    });
  } catch (error) {
    res.send({
      success: 0,
      msg: error.message,
    });
  }
});

router.post('/addHistory', async (req, res) => {
  try {
    const param = req.body;
    const dateNow = moment()
      .tz('Asia/Jakarta')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
    const parsedParams = querystring.parse(param.toString());
    // console.log(parsedParams);
    const jenisKendaraan = _.get(parsedParams, 'jenis_kendaraan', '');
    const nopol = _.get(parsedParams, 'nopol', '');
    const pool = _.get(parsedParams, 'pool', '');
    const tanggalMasuk = _.get(parsedParams, 'tanggal_masuk', '');
    const parsedTglMasuk = moment(tanggalMasuk)
      .tz('Asia/Jakarta')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
    const tarif = jenisKendaraan.toUpperCase() === 'MOTOR' ? 2000 : 5000;
    // await sequelize.query(
    //   `INSERT INTO parking(jenis_kendaraan,nomor_polisi,tarif,pool,tanggal, tanggal_masuk) VALUES('${jenisKendaraan}','${nopol}','${tarif}','${pool}','${dateNow}', '${parsedTglMasuk}')`,
    //   {
    //     type: Sequelize.QueryTypes.INSERT,
    //   }
    // );
    res.send({
      success: 1,
      msg: 'Tercatat di History!',
    });
  } catch (error) {
    res.send({
      success: 0,
      msg: error.message,
    });
  }
});

router.get('/fetchHistory', async (req, res) => {
  try {
    const where = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const key in req.query) {
      const keys = [
        'id_parking',
        'jenis_kendaraan',
        'nomor_polisi',
        'pool',
        'tanggal',
        'tarif',
      ];
      if (keys.includes(key)) where.push(`${key} = '${req.query[key]}'`);
    }
    const data = await sequelize.query(
      `SELECT * FROM parking WHERE ${where.toString().replace(/,/g, ' AND ')}`,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    data.forEach((element) => {
      element.tanggal = moment(element.tanggal)
        .tz('Asia/Jakarta')
        .format('YYYY-MM-DD HH:mm:ss');
      element.tanggal_masuk = moment(element.tanggal_masuk)
        .tz('Asia/Jakarta')
        .format('YYYY-MM-DD HH:mm:ss');
    });
    res.send({
      success: 1,
      data,
    });
  } catch (error) {
    res.send({
      success: 0,
      msg: error.message,
    });
  }
});

router.get('/fetchReport', async (req, res) => {
  try {
    let earning = 0;
    const pool = _.get(req, 'query.pool');
    const format = 'DD MMMM YYYY';
    const timezone = 'Asia/Jakarta';
    const where = {
      tanggal: {
        [Op.gte]: moment
          .tz(_.get(req, 'query.startDate'), format, timezone)
          .startOf('day'),
        [Op.lte]: moment
          .tz(_.get(req, 'query.endDate'), format, timezone)
          .endOf('day'),
      },
      jenis_kendaraan: {
        [Op.in]: ['Motor', 'Mobil'],
      },
    };
    if (!!pool && pool !== 'all') {
      where.pool = pool;
    }
    const parking = await parkingBean.findAll({
      attributes: [
        'id_parking',
        'jenis_kendaraan',
        'nomor_polisi',
        'tarif',
        'pool',
        'tanggal_masuk',
        [literal(`to_char(tanggal, 'DD-MM-YYYY')`), 'tanggal'],
      ],
      where,
    });
    parking.forEach((data) => {
      earning += parseInt(data.tarif, 10);
    });
    res.send({
      success: 1,
      data: {
        parking,
        earning,
      },
    });
  } catch (error) {
    res.send({
      success: 0,
      msg: error.message,
    });
  }
});

// \n\n\n\n\n
module.exports = router;

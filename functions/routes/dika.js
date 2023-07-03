/* eslint-disable guard-for-in */
const express = require('express');
const _ = require('lodash');
const querystring = require('querystring');

const { sequelize, Sequelize } = require('../db');

const router = express.Router();

router.post('/ubahStatus', async (req, res) => {
  try {
    const param = req.body;
    const parsedParams = querystring.parse(param.toString());
    console.log(parsedParams);
    const id = _.get(parsedParams, 'id_parking_status', null);
    const pool = _.get(parsedParams, 'pool', '');
    const status = _.get(parsedParams, 'status', '');
    const nopol = _.get(parsedParams, 'nopol', '');

    const cek = await sequelize.query(
      `SELECT id_parking_status FROM parking_status WHERE id_parking_status= '${id}'`,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (!_.isEmpty(cek)) {
      await sequelize.query(
        `UPDATE parking_status SET status = '${status}', nomor_polisi='${nopol}' WHERE id_parking_status = '${id}'`,
        {
          type: Sequelize.QueryTypes.UPDATE,
        }
      );
    } else {
      await sequelize.query(
        `INSERT INTO parking_status(id_parking_status,pool,nomor_polisi,status) VALUES('${id}','${pool}','${nopol}','${status}')`,
        {
          type: Sequelize.QueryTypes.INSERT,
        }
      );
    }
    res.send({
      success: 1,
      msg: 'Berhasil ubah status!',
    });
  } catch (error) {
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
    const parsedParams = querystring.parse(param.toString());
    console.log(parsedParams);
    const jenisKendaraan = _.get(parsedParams, 'jenis_kendaraan', '');
    const nopol = _.get(parsedParams, 'nopol', '');
    const pool = _.get(parsedParams, 'pool', '');
    const tarif = jenisKendaraan === 'motor' ? 2000 : 5000;
    await sequelize.query(
      `INSERT INTO parking(jenis_kendaraan,nomor_polisi,tarif,pool,tanggal) VALUES('${jenisKendaraan}','${nopol}','${tarif}','${pool}',NOW())`,
      {
        type: Sequelize.QueryTypes.INSERT,
      }
    );
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

module.exports = router;

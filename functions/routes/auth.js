const express = require('express');
const authController = require('../controller/AuthController');

const router = express.Router();

router.post('/authentications', authController.postAuth);
router.put('/authentications', authController.refresh);
router.delete('/authentications', authController.delete);

module.exports = router;

const express = require('express');
const statusController = require('../controllers/statusController');

const router = express.Router();

router.get('/status/:requestId', statusController.getStatus);

module.exports = router;

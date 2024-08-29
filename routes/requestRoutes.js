const express = require('express');
const multer = require('multer');
const requestController = require('../controllers/requestController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), requestController.uploadCSV);

module.exports = router;

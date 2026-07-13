const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

// File upload and processing routes
router.post('/upload', fileController.uploadFile);
router.post('/detect-type', fileController.detectFileType);
router.get('/supported-formats', fileController.getSupportedFormats);

module.exports = router;

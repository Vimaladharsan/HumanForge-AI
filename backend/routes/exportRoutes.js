const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');

// Export routes
router.post('/export', exportController.exportDocument);
router.get('/download/:filename', exportController.downloadExport);

module.exports = router;

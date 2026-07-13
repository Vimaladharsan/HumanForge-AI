const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');

// Export routes
router.post('/export', exportController.exportDocument);

module.exports = router;

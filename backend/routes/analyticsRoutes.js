const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Analytics routes
router.post('/analyze', analyticsController.analyzeDocument);
router.post('/code-metrics', analyticsController.getCodeMetrics);

module.exports = router;

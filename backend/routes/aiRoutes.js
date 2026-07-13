const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// AI processing routes
router.post('/humanize', aiController.humanizeText);
router.post('/review', aiController.reviewDocument);
router.post('/analyze-code', aiController.analyzeCode);
router.post('/optimize-resume', aiController.optimizeResume);
router.post('/explain', aiController.explainContent);
router.post('/review-documentation', aiController.reviewDocumentation);

module.exports = router;

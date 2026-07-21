const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.use(optionalAuth);

router.post('/humanize', aiController.humanizeText);
router.post('/review', aiController.reviewDocument);
router.post('/analyze-code', aiController.analyzeCode);
router.post('/optimize-resume', aiController.optimizeResume);
router.post('/explain', aiController.explainContent);
router.post('/review-documentation', aiController.reviewDocumentation);
router.post('/detect', aiController.detectAI);
router.post('/chat', aiController.chatFollowUp);

module.exports = router;

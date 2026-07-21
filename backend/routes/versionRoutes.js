const express = require('express');
const router = express.Router();
const versionController = require('../controllers/versionController');

// Version history routes
router.post('/save', versionController.saveVersion);
router.get('/:documentId', versionController.getVersions);
router.get('/:documentId/version/:versionId', versionController.getVersion);
router.get('/:documentId/compare/:version1/:version2', versionController.compareVersions);
router.post('/:documentId/restore/:versionId', versionController.restoreVersion);

module.exports = router;

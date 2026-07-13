const express = require('express');
const router = express.Router();

// Import route modules
const fileRoutes = require('./fileRoutes');
const aiRoutes = require('./aiRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const versionRoutes = require('./versionRoutes');
const exportRoutes = require('./exportRoutes');

// Mount routes
router.use('/files', fileRoutes);
router.use('/ai', aiRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/versions', versionRoutes);
router.use('/export', exportRoutes);

module.exports = router;

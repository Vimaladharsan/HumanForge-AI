const analyticsService = require('../services/analyticsService');

// Analyze document
const analyzeDocument = async (req, res) => {
  try {
    const { content, fileType } = req.body;
    const result = await analyticsService.analyzeDocument(content, fileType);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get code metrics
const getCodeMetrics = async (req, res) => {
  try {
    const { code, language } = req.body;
    const result = await analyticsService.getCodeMetrics(code, language);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  analyzeDocument,
  getCodeMetrics
};

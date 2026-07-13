const exportService = require('../services/exportService');

// Export document
const exportDocument = async (req, res) => {
  try {
    const { content, format, filename } = req.body;
    const result = await exportService.exportDocument(content, format, filename);
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
  exportDocument
};

const path = require('path');
const fs = require('fs-extra');
const exportService = require('../services/exportService');

const exportsDir = path.join(__dirname, '../exports');

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

// Download a previously exported file
const downloadExport = async (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    const filePath = path.join(exportsDir, filename);

    if (!filePath.startsWith(exportsDir) || !await fs.pathExists(filePath)) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }

    res.download(filePath, filename);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  exportDocument,
  downloadExport
};

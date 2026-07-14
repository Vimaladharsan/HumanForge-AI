const fileService = require('../services/fileService');

// Upload and process file
const uploadFile = async (req, res) => {
  try {
    const result = await fileService.processFile(req);
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


const detectFileType = async (req, res) => {
  try {
    const { filename, content } = req.body;
    const fileType = fileService.detectFileType(filename, content);
    res.json({
      success: true,
      data: fileType
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get supported formats
const getSupportedFormats = (req, res) => {
  const formats = fileService.getSupportedFormats();
  res.json({
    success: true,
    data: formats
  });
};

module.exports = {
  uploadFile,
  detectFileType,
  getSupportedFormats
};

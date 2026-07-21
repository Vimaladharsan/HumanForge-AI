const versionService = require('../services/versionService');

// Save version
const saveVersion = async (req, res) => {
  try {
    const { documentId, content, metadata } = req.body;
    const result = await versionService.saveVersion(documentId, content, metadata);
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

// Get versions
const getVersions = async (req, res) => {
  try {
    const { documentId } = req.params;
    const versions = await versionService.getVersions(documentId);
    res.json({
      success: true,
      data: versions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get a single version
const getVersion = async (req, res) => {
  try {
    const { documentId, versionId } = req.params;
    const version = await versionService.getVersion(documentId, versionId);
    res.json({
      success: true,
      data: version
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
};

// Compare versions
const compareVersions = async (req, res) => {
  try {
    const { documentId, version1, version2 } = req.params;
    const comparison = await versionService.compareVersions(documentId, version1, version2);
    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Restore version
const restoreVersion = async (req, res) => {
  try {
    const { documentId, versionId } = req.params;
    const result = await versionService.restoreVersion(documentId, versionId);
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
  saveVersion,
  getVersions,
  getVersion,
  compareVersions,
  restoreVersion
};

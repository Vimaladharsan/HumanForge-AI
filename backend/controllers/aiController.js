const aiService = require('../services/aiService');

// Humanize text
const humanizeText = async (req, res) => {
  try {
    const { text, tone, options } = req.body;
    const result = await aiService.humanizeText(text, tone, options);
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

// Review document
const reviewDocument = async (req, res) => {
  try {
    const { content, fileType } = req.body;
    const result = await aiService.reviewDocument(content, fileType);
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

// Analyze code
const analyzeCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    const result = await aiService.analyzeCode(code, language);
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

// Optimize resume
const optimizeResume = async (req, res) => {
  try {
    const { content } = req.body;
    const result = await aiService.optimizeResume(content);
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

// Explain content
const explainContent = async (req, res) => {
  try {
    const { content, context } = req.body;
    const result = await aiService.explainContent(content, context);
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
  humanizeText,
  reviewDocument,
  analyzeCode,
  optimizeResume,
  explainContent
};

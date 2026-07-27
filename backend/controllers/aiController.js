const aiService = require('../services/aiService');
const aiDetectionService = require('../services/aiDetectionService');
const historyService = require('../services/historyService');

const saveHistory = (req, feature, input, output, metadata) => {
  if (req.user) {
    historyService.saveEntry(req.user.id, feature, input, output, metadata);
  }
};

// Humanize text
const humanizeText = async (req, res) => {
  try {
    const { text, tone, options } = req.body;
    if (!text) return res.status(400).json({ success: false, error: 'text is required' });

    const beforeScore = aiDetectionService.scoreText(text);
    const result = await aiService.humanizeText(text, tone, options);
    const afterScore = aiDetectionService.scoreText(result.humanizedText);
    const data = { ...result, detectionScores: { before: beforeScore, after: afterScore } };

    saveHistory(req, 'humanize', { text, tone }, data);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Review document
const reviewDocument = async (req, res) => {
  try {
    const { content, fileType, reviewType } = req.body;
    if (!content) return res.status(400).json({ success: false, error: 'content is required' });
    const result = await aiService.reviewDocument(content, fileType, reviewType);

    saveHistory(req, 'review', { content, fileType, reviewType }, result);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Analyze code
const analyzeCode = async (req, res) => {
  try {
    const { code, language, analysisType } = req.body;
    if (!code) return res.status(400).json({ success: false, error: 'code is required' });
    const result = await aiService.analyzeCode(code, language, analysisType);

    saveHistory(req, 'code-analysis', { code, language, analysisType }, result);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Optimize resume
const optimizeResume = async (req, res) => {
  try {
    const { content, optimizationType } = req.body;
    if (!content) return res.status(400).json({ success: false, error: 'content is required' });
    const result = await aiService.optimizeResume(content, optimizationType);

    saveHistory(req, 'resume', { content, optimizationType }, result);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Explain content
const explainContent = async (req, res) => {
  try {
    const { content, context, explanationType } = req.body;
    if (!content) return res.status(400).json({ success: false, error: 'content is required' });
    const result = await aiService.explainContent(content, context, explanationType);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Review documentation
const reviewDocumentation = async (req, res) => {
  try {
    const { content, docType } = req.body;
    if (!content) return res.status(400).json({ success: false, error: 'content is required' });
    const result = await aiService.reviewDocumentation(content, docType);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Score text for AI detection (standalone endpoint)
const detectAI = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, error: 'text is required' });
    const scores = aiDetectionService.scoreText(text);
    res.json({ success: true, data: scores });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Chat follow-up
const chatFollowUp = async (req, res) => {
  try {
    const { message, history = [], context = '' } = req.body;
    if (!message) return res.status(400).json({ success: false, error: 'message is required' });
    const result = await aiService.chat(message, history, context);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  humanizeText,
  reviewDocument,
  analyzeCode,
  optimizeResume,
  explainContent,
  reviewDocumentation,
  detectAI,
  chatFollowUp
};

const { GoogleGenerativeAI } = require('@google/generative-ai');
const promptEngine = require('./promptEngine');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const GEMINI_MODEL = 'gemini-2.0-flash';

// Generate text via Gemini
const generate = async (prompt) => {
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  const result = await model.generateContent(prompt);
  return result.response.text();
};

// Humanize text
const humanizeText = async (text, tone = 'professional', options = {}) => {
  try {
    const basePrompt = promptEngine.generatePrompt('humanize', tone, options);
    const prompt = `${basePrompt}\n\nOriginal text:\n${text}\n\nReturn ONLY the rewritten text — no explanations, no preamble.`;
    const humanizedText = await generate(prompt);
    return { originalText: text, humanizedText, tone };
  } catch (error) {
    throw new Error(`AI humanization failed: ${error.message}`);
  }
};

// Review document
const reviewDocument = async (content, fileType, reviewType = 'general') => {
  try {
    const basePrompt = promptEngine.generatePrompt('review', reviewType);
    const prompt = `${basePrompt}\n\nDocument type: ${fileType}\n\nDocument content:\n${content}`;
    const review = await generate(prompt);
    return { review, fileType, reviewType, timestamp: new Date().toISOString() };
  } catch (error) {
    throw new Error(`Document review failed: ${error.message}`);
  }
};

// Analyze code
const analyzeCode = async (code, language, analysisType = 'review') => {
  try {
    const basePrompt = promptEngine.generatePrompt('code', analysisType);
    const prompt = `${basePrompt}\n\nLanguage: ${language}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\``;
    const analysis = await generate(prompt);
    return { analysis, language, analysisType, timestamp: new Date().toISOString() };
  } catch (error) {
    throw new Error(`Code analysis failed: ${error.message}`);
  }
};

// Optimize resume
const optimizeResume = async (content, optimizationType = 'content') => {
  try {
    const basePrompt = promptEngine.generatePrompt('resume', optimizationType);
    const prompt = `${basePrompt}\n\nResume content:\n${content}`;
    const optimization = await generate(prompt);
    return { optimization, optimizationType, timestamp: new Date().toISOString() };
  } catch (error) {
    throw new Error(`Resume optimization failed: ${error.message}`);
  }
};

// Explain content
const explainContent = async (content, context = '', explanationType = 'concept') => {
  try {
    const basePrompt = promptEngine.generatePrompt('explain', explanationType);
    const prompt = `${basePrompt}\n\n${context ? `Context: ${context}\n\n` : ''}Content to explain:\n${content}`;
    const explanation = await generate(prompt);
    return { explanation, context, explanationType, timestamp: new Date().toISOString() };
  } catch (error) {
    throw new Error(`Content explanation failed: ${error.message}`);
  }
};

// Review documentation
const reviewDocumentation = async (content, docType = 'readme') => {
  try {
    const basePrompt = promptEngine.generatePrompt('documentation', docType);
    const prompt = `${basePrompt}\n\nDocumentation content:\n${content}`;
    const review = await generate(prompt);
    return { review, docType, timestamp: new Date().toISOString() };
  } catch (error) {
    throw new Error(`Documentation review failed: ${error.message}`);
  }
};

// Chat follow-up within a conversation context
const chat = async (message, history = [], context = '') => {
  try {
    const systemPrefix = context
      ? `You are a helpful AI assistant. Previous analysis context:\n\n${context}\n\n`
      : '';
    const reply = await generate(`${systemPrefix}${message}`);
    return {
      reply,
      history: [...history, { role: 'user', content: message }, { role: 'assistant', content: reply }]
    };
  } catch (error) {
    throw new Error(`Chat failed: ${error.message}`);
  }
};

module.exports = {
  humanizeText,
  reviewDocument,
  analyzeCode,
  optimizeResume,
  explainContent,
  reviewDocumentation,
  chat
};

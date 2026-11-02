const { GoogleGenerativeAI } = require('@google/generative-ai');
const promptEngine = require('./promptEngine');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Google retires model versions, and a retired id makes every AI feature fail
// with a 404 (gemini-2.0-flash did exactly that). Override with GEMINI_MODEL
// when this one is retired, or to track an alias such as gemini-flash-latest.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

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

    // Replay the prior turns so follow-ups ("what about the second point?")
    // actually resolve against the conversation instead of being sent alone.
    const contents = [];
    for (const turn of history) {
      if (!turn || typeof turn.content !== 'string') continue;
      const role = turn.role === 'assistant' ? 'model' : 'user';
      // Gemini requires the transcript to start with a user turn.
      if (!contents.length && role !== 'user') continue;
      contents.push({ role, parts: [{ text: turn.content }] });
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    // The analysis context belongs on the opening turn, not on every message.
    if (systemPrefix) {
      contents[0].parts = [{ text: `${systemPrefix}${contents[0].parts[0].text}` }];
    }

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const result = await model.generateContent({ contents });
    const reply = result.response.text();

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

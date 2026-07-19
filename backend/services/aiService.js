const { GoogleGenerativeAI } = require('@google/generative-ai');
const Anthropic = require('@anthropic-ai/sdk');
const promptEngine = require('./promptEngine');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

const GEMINI_MODEL = 'gemini-2.0-flash';
const CLAUDE_MODEL = 'claude-sonnet-5';

// Generate text via the chosen provider
const generate = async (prompt, provider = 'gemini', conversationHistory = []) => {
  if (provider === 'claude') {
    const messages = [
      ...conversationHistory,
      { role: 'user', content: prompt }
    ];
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      messages
    });
    return response.content[0].text;
  }

  // Default: Gemini
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  const result = await model.generateContent(prompt);
  return result.response.text();
};

// Humanize text
const humanizeText = async (text, tone = 'professional', options = {}, provider = 'gemini') => {
  try {
    const basePrompt = promptEngine.generatePrompt('humanize', tone, options);
    const prompt = `${basePrompt}\n\nOriginal text:\n${text}\n\nReturn ONLY the rewritten text — no explanations, no preamble.`;
    const humanizedText = await generate(prompt, provider);
    return { originalText: text, humanizedText, tone, provider };
  } catch (error) {
    throw new Error(`AI humanization failed: ${error.message}`);
  }
};

// Review document
const reviewDocument = async (content, fileType, reviewType = 'general', provider = 'gemini') => {
  try {
    const basePrompt = promptEngine.generatePrompt('review', reviewType);
    const prompt = `${basePrompt}\n\nDocument type: ${fileType}\n\nDocument content:\n${content}`;
    const review = await generate(prompt, provider);
    return { review, fileType, reviewType, provider, timestamp: new Date().toISOString() };
  } catch (error) {
    throw new Error(`Document review failed: ${error.message}`);
  }
};

// Analyze code
const analyzeCode = async (code, language, analysisType = 'review', provider = 'gemini') => {
  try {
    const basePrompt = promptEngine.generatePrompt('code', analysisType);
    const prompt = `${basePrompt}\n\nLanguage: ${language}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\``;
    const analysis = await generate(prompt, provider);
    return { analysis, language, analysisType, provider, timestamp: new Date().toISOString() };
  } catch (error) {
    throw new Error(`Code analysis failed: ${error.message}`);
  }
};

// Optimize resume
const optimizeResume = async (content, optimizationType = 'content', provider = 'gemini') => {
  try {
    const basePrompt = promptEngine.generatePrompt('resume', optimizationType);
    const prompt = `${basePrompt}\n\nResume content:\n${content}`;
    const optimization = await generate(prompt, provider);
    return { optimization, optimizationType, provider, timestamp: new Date().toISOString() };
  } catch (error) {
    throw new Error(`Resume optimization failed: ${error.message}`);
  }
};

// Explain content
const explainContent = async (content, context = '', explanationType = 'concept', provider = 'gemini') => {
  try {
    const basePrompt = promptEngine.generatePrompt('explain', explanationType);
    const prompt = `${basePrompt}\n\n${context ? `Context: ${context}\n\n` : ''}Content to explain:\n${content}`;
    const explanation = await generate(prompt, provider);
    return { explanation, context, explanationType, provider, timestamp: new Date().toISOString() };
  } catch (error) {
    throw new Error(`Content explanation failed: ${error.message}`);
  }
};

// Review documentation
const reviewDocumentation = async (content, docType = 'readme', provider = 'gemini') => {
  try {
    const basePrompt = promptEngine.generatePrompt('documentation', docType);
    const prompt = `${basePrompt}\n\nDocumentation content:\n${content}`;
    const review = await generate(prompt, provider);
    return { review, docType, provider, timestamp: new Date().toISOString() };
  } catch (error) {
    throw new Error(`Documentation review failed: ${error.message}`);
  }
};

// Chat follow-up within a conversation context
const chat = async (message, history = [], context = '', provider = 'gemini') => {
  try {
    if (provider === 'claude') {
      const messages = [
        ...history,
        { role: 'user', content: message }
      ];
      const systemPrompt = context
        ? `You are a helpful AI assistant for the HumanForge AI platform. Context from the previous analysis:\n\n${context}`
        : 'You are a helpful AI assistant for the HumanForge AI platform.';

      const response = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 2048,
        system: systemPrompt,
        messages
      });
      const reply = response.content[0].text;
      return {
        reply,
        history: [...messages, { role: 'assistant', content: reply }],
        provider
      };
    }

    // Gemini chat
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const systemPrefix = context
      ? `You are a helpful AI assistant. Previous analysis context:\n\n${context}\n\n`
      : '';
    const fullPrompt = `${systemPrefix}${message}`;
    const result = await model.generateContent(fullPrompt);
    const reply = result.response.text();
    return {
      reply,
      history: [...history, { role: 'user', content: message }, { role: 'assistant', content: reply }],
      provider
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

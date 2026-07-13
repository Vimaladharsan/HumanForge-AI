const { GoogleGenerativeAI } = require('@google/generative-ai');
const promptEngine = require('./promptEngine');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Humanize text with different tones
const humanizeText = async (text, tone = 'professional', options = {}) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Use prompt engine for specialized prompts
    const basePrompt = promptEngine.generatePrompt('humanize', tone, options);
    const prompt = `${basePrompt}\n\nOriginal text:\n${text}\n\nProvide the rewritten text and explain the changes made.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    return {
      originalText: text,
      humanizedText: responseText,
      tone: tone,
      explanation: 'Text has been rewritten with the specified tone using specialized AI workflow.'
    };
  } catch (error) {
    throw new Error(`AI humanization failed: ${error.message}`);
  }
};

// Review document
const reviewDocument = async (content, fileType, reviewType = 'general') => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Use prompt engine for specialized review prompts
    const basePrompt = promptEngine.generatePrompt('review', reviewType);
    const prompt = `${basePrompt}\n\nDocument type: ${fileType}\n\nDocument content:\n${content}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    return {
      review: responseText,
      fileType: fileType,
      reviewType: reviewType,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Document review failed: ${error.message}`);
  }
};

// Analyze code
const analyzeCode = async (code, language, analysisType = 'review') => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Use prompt engine for specialized code analysis prompts
    const basePrompt = promptEngine.generatePrompt('code', analysisType);
    const prompt = `${basePrompt}\n\nLanguage: ${language}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\``;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    return {
      analysis: responseText,
      language: language,
      analysisType: analysisType,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Code analysis failed: ${error.message}`);
  }
};

// Optimize resume
const optimizeResume = async (content, optimizationType = 'content') => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Use prompt engine for specialized resume optimization prompts
    const basePrompt = promptEngine.generatePrompt('resume', optimizationType);
    const prompt = `${basePrompt}\n\nResume content:\n${content}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    return {
      optimization: responseText,
      optimizationType: optimizationType,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Resume optimization failed: ${error.message}`);
  }
};

// Explain content
const explainContent = async (content, context = '', explanationType = 'concept') => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Use prompt engine for specialized explanation prompts
    const basePrompt = promptEngine.generatePrompt('explain', explanationType);
    const prompt = `${basePrompt}\n\n${context ? `Context: ${context}\n\n` : ''}Content to explain:\n${content}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    return {
      explanation: responseText,
      context: context,
      explanationType: explanationType,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Content explanation failed: ${error.message}`);
  }
};

// Review documentation
const reviewDocumentation = async (content, docType = 'readme') => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Use prompt engine for specialized documentation prompts
    const basePrompt = promptEngine.generatePrompt('documentation', docType);
    const prompt = `${basePrompt}\n\nDocumentation content:\n${content}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    return {
      review: responseText,
      docType: docType,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Documentation review failed: ${error.message}`);
  }
};

module.exports = {
  humanizeText,
  reviewDocument,
  analyzeCode,
  optimizeResume,
  explainContent,
  reviewDocumentation
};

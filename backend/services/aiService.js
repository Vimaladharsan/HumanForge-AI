const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Humanize text with different tones
const humanizeText = async (text, tone = 'professional', options = {}) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const toneInstructions = {
      natural: 'Rewrite the text to sound more natural and human-like.',
      professional: 'Rewrite the text with a professional, business-appropriate tone.',
      academic: 'Rewrite the text with an academic, scholarly tone suitable for research papers.',
      friendly: 'Rewrite the text with a friendly, conversational tone.',
      business: 'Rewrite the text with a formal business tone.',
      technical: 'Rewrite the text with clear technical language appropriate for documentation.',
      simple: 'Simplify the text to make it easier to understand.',
      expanded: 'Expand the text with more detail and elaboration.',
      concise: 'Make the text more concise and to the point.'
    };
    
    const instruction = toneInstructions[tone] || toneInstructions.professional;
    
    const prompt = `${instruction}\n\nOriginal text:\n${text}\n\nProvide the rewritten text and explain the changes made.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    return {
      originalText: text,
      humanizedText: responseText,
      tone: tone,
      explanation: 'Text has been rewritten with the specified tone.'
    };
  } catch (error) {
    throw new Error(`AI humanization failed: ${error.message}`);
  }
};

// Review document
const reviewDocument = async (content, fileType) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Review the following ${fileType} document for:
1. Grammar and spelling errors
2. Readability issues
3. Vocabulary improvements
4. Passive voice usage
5. Overall structure and flow
6. Writing quality score (1-10)

Provide specific suggestions with explanations for each issue found.

Document content:
${content}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    return {
      review: responseText,
      fileType: fileType,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Document review failed: ${error.message}`);
  }
};

// Analyze code
const analyzeCode = async (code, language) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Analyze the following ${language} code for:
1. Code explanation (what it does)
2. Potential bugs or issues
3. Refactoring suggestions
4. Naming improvements
5. Performance recommendations
6. Best practices violations
7. Documentation needs

Provide specific, actionable suggestions with explanations.

Code:
\`\`\`${language}
${code}
\`\`\``;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    return {
      analysis: responseText,
      language: language,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Code analysis failed: ${error.message}`);
  }
};

// Optimize resume
const optimizeResume = async (content) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Optimize the following resume for ATS (Applicant Tracking Systems) and improve its overall effectiveness:
1. ATS keyword optimization
2. Structure and formatting improvements
3. Content enhancement
4. Achievement quantification suggestions
5. Skills section improvements
6. Summary optimization

Provide specific suggestions with explanations.

Resume content:
${content}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    return {
      optimization: responseText,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Resume optimization failed: ${error.message}`);
  }
};

// Explain content
const explainContent = async (content, context = '') => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Explain the following content in clear, simple terms${context ? ` given this context: ${context}` : ''}:
1. What is the main purpose?
2. Key concepts and terminology
3. How it works (if applicable)
4. Why it matters
5. Practical applications

Content to explain:
${content}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    return {
      explanation: responseText,
      context: context,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Content explanation failed: ${error.message}`);
  }
};

module.exports = {
  humanizeText,
  reviewDocument,
  analyzeCode,
  optimizeResume,
  explainContent
};

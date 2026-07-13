// Analyze document for writing analytics
const analyzeDocument = (content, fileType) => {
  const analytics = {
    wordCount: 0,
    characterCount: 0,
    sentenceCount: 0,
    paragraphCount: 0,
    readingTime: 0,
    readabilityScore: 0,
    vocabularyDiversity: 0,
    averageSentenceLength: 0,
    averageWordLength: 0,
    repeatedWords: [],
    longSentences: [],
    fileType: fileType
  };
  
  // Word count
  const words = content.split(/\s+/).filter(word => word.length > 0);
  analytics.wordCount = words.length;
  
  // Character count
  analytics.characterCount = content.length;
  
  // Sentence count (basic estimation)
  const sentences = content.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  analytics.sentenceCount = sentences.length;
  
  // Paragraph count
  const paragraphs = content.split(/\n\n+/).filter(para => para.trim().length > 0);
  analytics.paragraphCount = paragraphs.length;
  
  // Reading time (average 200 words per minute)
  analytics.readingTime = Math.ceil(analytics.wordCount / 200);
  
  // Average sentence length
  analytics.averageSentenceLength = analytics.sentenceCount > 0 
    ? Math.round(analytics.wordCount / analytics.sentenceCount) 
    : 0;
  
  // Average word length
  const totalWordLength = words.reduce((sum, word) => sum + word.length, 0);
  analytics.averageWordLength = analytics.wordCount > 0 
    ? Math.round(totalWordLength / analytics.wordCount) 
    : 0;
  
  // Vocabulary diversity (unique words / total words)
  const uniqueWords = new Set(words.map(word => word.toLowerCase()));
  analytics.vocabularyDiversity = analytics.wordCount > 0 
    ? Math.round((uniqueWords.size / analytics.wordCount) * 100) 
    : 0;
  
  // Basic readability score (simplified Flesch Reading Ease)
  if (analytics.sentenceCount > 0 && analytics.wordCount > 0) {
    const avgSentenceLength = analytics.wordCount / analytics.sentenceCount;
    const avgSyllables = analytics.wordCount; // Simplified approximation
    const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * (avgSyllables / analytics.wordCount));
    analytics.readabilityScore = Math.max(0, Math.min(100, Math.round(fleschScore)));
  }
  
  // Find repeated words (appearing more than 3 times)
  const wordFrequency = {};
  words.forEach(word => {
    const lowerWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (lowerWord.length > 3) {
      wordFrequency[lowerWord] = (wordFrequency[lowerWord] || 0) + 1;
    }
  });
  
  analytics.repeatedWords = Object.entries(wordFrequency)
    .filter(([word, count]) => count > 3)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // Find long sentences (more than 30 words)
  analytics.longSentences = sentences
    .map((sentence, index) => ({
      index: index + 1,
      text: sentence.trim(),
      wordCount: sentence.split(/\s+/).length
    }))
    .filter(item => item.wordCount > 30)
    .slice(0, 5);
  
  return analytics;
};

// Get code metrics
const getCodeMetrics = (code, language) => {
  const metrics = {
    language: language,
    linesOfCode: 0,
    blankLines: 0,
    commentLines: 0,
    codeLines: 0,
    functions: 0,
    classes: 0,
    averageLineLength: 0,
    maxLineLength: 0,
    complexity: 0
  };
  
  const lines = code.split('\n');
  metrics.linesOfCode = lines.length;
  
  lines.forEach(line => {
    const trimmed = line.trim();
    
    // Blank lines
    if (trimmed.length === 0) {
      metrics.blankLines++;
    }
    // Comment lines (basic detection)
    else if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      metrics.commentLines++;
    } else {
      metrics.codeLines++;
    }
  });
  
  // Function detection (basic)
  const functionPatterns = {
    javascript: /function\s+\w+|const\s+\w+\s*=\s*\(|=>\s*{/g,
    python: /def\s+\w+/g,
    java: /public|private|protected\s+\w+\s+\w+\s*\(/g,
    c: /\w+\s+\w+\s*\([^)]*\)\s*{/g
  };
  
  const pattern = functionPatterns[language] || functionPatterns.javascript;
  const matches = code.match(pattern);
  metrics.functions = matches ? matches.length : 0;
  
  // Class detection
  const classPattern = /class\s+\w+/g;
  const classMatches = code.match(classPattern);
  metrics.classes = classMatches ? classMatches.length : 0;
  
  // Line length metrics
  const lineLengths = lines.map(line => line.length);
  metrics.averageLineLength = lineLengths.length > 0 
    ? Math.round(lineLengths.reduce((a, b) => a + b, 0) / lineLengths.length) 
    : 0;
  metrics.maxLineLength = Math.max(...lineLengths);
  
  // Basic complexity (simplified cyclomatic complexity approximation)
  metrics.complexity = (code.match(/if|else|for|while|switch|case|catch|try/g) || []).length;
  
  return metrics;
};

module.exports = {
  analyzeDocument,
  getCodeMetrics
};

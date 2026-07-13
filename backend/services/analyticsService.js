// Count syllables in a word (approximation)
const countSyllables = (word) => {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
};

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
    averageSyllablesPerWord: 0,
    repeatedWords: [],
    longSentences: [],
    shortSentences: [],
    passiveVoiceCount: 0,
    complexWords: [],
    sentiment: 'neutral',
    fileType: fileType,
    gradeLevel: 0
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
  
  // Average syllables per word
  const totalSyllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
  analytics.averageSyllablesPerWord = analytics.wordCount > 0 
    ? Math.round((totalSyllables / analytics.wordCount) * 10) / 10 
    : 0;
  
  // Vocabulary diversity (unique words / total words)
  const uniqueWords = new Set(words.map(word => word.toLowerCase()));
  analytics.vocabularyDiversity = analytics.wordCount > 0 
    ? Math.round((uniqueWords.size / analytics.wordCount) * 100) 
    : 0;
  
  // Flesch Reading Ease score
  if (analytics.sentenceCount > 0 && analytics.wordCount > 0) {
    const avgSentenceLength = analytics.wordCount / analytics.sentenceCount;
    const avgSyllablesPerWord = totalSyllables / analytics.wordCount;
    const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    analytics.readabilityScore = Math.max(0, Math.min(100, Math.round(fleschScore)));
    
    // Flesch-Kincaid Grade Level
    const gradeLevel = 0.39 * avgSentenceLength + 11.8 * avgSyllablesPerWord - 15.59;
    analytics.gradeLevel = Math.max(0, Math.round(gradeLevel * 10) / 10);
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
  
  // Find short sentences (less than 5 words)
  analytics.shortSentences = sentences
    .map((sentence, index) => ({
      index: index + 1,
      text: sentence.trim(),
      wordCount: sentence.split(/\s+/).length
    }))
    .filter(item => item.wordCount < 5 && item.wordCount > 0)
    .slice(0, 5);
  
  // Detect passive voice (basic pattern matching)
  const passivePatterns = /\b(was|were|been|being)\s+\w+ed\b/gi;
  const passiveMatches = content.match(passivePatterns);
  analytics.passiveVoiceCount = passiveMatches ? passiveMatches.length : 0;
  
  // Find complex words (more than 3 syllables)
  analytics.complexWords = words
    .filter(word => countSyllables(word) > 3)
    .map(word => ({ word, syllables: countSyllables(word) }))
    .slice(0, 10);
  
  // Basic sentiment analysis (keyword-based)
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'positive', 'success', 'love', 'happy'];
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'negative', 'failure', 'hate', 'sad', 'poor', 'worst'];
  
  const lowerContent = content.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerContent.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerContent.includes(word)).length;
  
  if (positiveCount > negativeCount * 1.5) {
    analytics.sentiment = 'positive';
  } else if (negativeCount > positiveCount * 1.5) {
    analytics.sentiment = 'negative';
  } else {
    analytics.sentiment = 'neutral';
  }
  
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
    interfaces: 0,
    averageLineLength: 0,
    maxLineLength: 0,
    complexity: 0,
    maintainabilityIndex: 0,
    codeDensity: 0,
    nestingDepth: 0,
    duplicateLines: 0,
    imports: 0,
    TODOs: 0,
    FIXMEs: 0
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
    else if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('--')) {
      metrics.commentLines++;
    } else {
      metrics.codeLines++;
    }
  });
  
  // Function detection (basic)
  const functionPatterns = {
    javascript: /function\s+\w+|const\s+\w+\s*=\s*\(|=>\s*{/g,
    typescript: /function\s+\w+|const\s+\w+\s*=\s*\(|=>\s*{/g,
    python: /def\s+\w+/g,
    java: /public|private|protected\s+\w+\s+\w+\s*\(/g,
    c: /\w+\s+\w+\s*\([^)]*\)\s*{/g,
    cpp: /\w+\s+\w+\s*\([^)]*\)\s*{/g,
    csharp: /\w+\s+\w+\s*\([^)]*\)\s*{/g,
    go: /func\s+\w+/g,
    rust: /fn\s+\w+/g,
    php: /function\s+\w+/g
  };
  
  const pattern = functionPatterns[language] || functionPatterns.javascript;
  const matches = code.match(pattern);
  metrics.functions = matches ? matches.length : 0;
  
  // Class detection
  const classPattern = /class\s+\w+/g;
  const classMatches = code.match(classPattern);
  metrics.classes = classMatches ? classMatches.length : 0;
  
  // Interface detection
  const interfacePattern = /interface\s+\w+/g;
  const interfaceMatches = code.match(interfacePattern);
  metrics.interfaces = interfaceMatches ? interfaceMatches.length : 0;
  
  // Line length metrics
  const lineLengths = lines.map(line => line.length);
  metrics.averageLineLength = lineLengths.length > 0 
    ? Math.round(lineLengths.reduce((a, b) => a + b, 0) / lineLengths.length) 
    : 0;
  metrics.maxLineLength = Math.max(...lineLengths);
  
  // Basic complexity (simplified cyclomatic complexity approximation)
  const complexityKeywords = code.match(/if|else|for|while|switch|case|catch|try|&&|\|\|/g) || [];
  metrics.complexity = complexityKeywords.length;
  
  // Code density (code lines / total lines)
  metrics.codeDensity = metrics.linesOfCode > 0 
    ? Math.round((metrics.codeLines / metrics.linesOfCode) * 100) 
    : 0;
  
  // Nesting depth estimation
  let maxDepth = 0;
  let currentDepth = 0;
  lines.forEach(line => {
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;
    currentDepth += openBraces - closeBraces;
    if (currentDepth > maxDepth) {
      maxDepth = currentDepth;
    }
  });
  metrics.nestingDepth = maxDepth;
  
  // Import detection
  const importPatterns = [
    /import\s+/g,
    /require\s*\(/g,
    /#include/g,
    /using\s+/g
  ];
  importPatterns.forEach(pattern => {
    const matches = code.match(pattern);
    if (matches) {
      metrics.imports += matches.length;
    }
  });
  
  // TODO detection
  const todoMatches = code.match(/TODO|FIXME|HACK|XXX/gi);
  metrics.TODOs = todoMatches ? todoMatches.length : 0;
  
  // Maintainability index (simplified)
  const volume = metrics.linesOfCode * Math.log2(metrics.functions || 1);
  const difficulty = metrics.complexity / (metrics.functions || 1);
  metrics.maintainabilityIndex = Math.max(0, Math.min(100, Math.round(171 - 5.2 * Math.log(volume) - 0.23 * metrics.complexity - 16.2 * Math.log(metrics.linesOfCode))));
  
  // Duplicate line detection (basic)
  const lineMap = {};
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.length > 10) {
      lineMap[trimmed] = (lineMap[trimmed] || 0) + 1;
    }
  });
  metrics.duplicateLines = Object.values(lineMap).filter(count => count > 1).reduce((sum, count) => sum + count - 1, 0);
  
  return metrics;
};

module.exports = {
  analyzeDocument,
  getCodeMetrics
};

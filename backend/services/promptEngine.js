// Prompt Engine - Specialized AI prompts for different workflows

const PROMPTS = {
  // Humanization Prompts
  humanize: {
    natural: {
      instruction: 'Rewrite the text to sound more natural and human-like, avoiding robotic or AI-generated patterns.',
      context: 'Focus on natural flow, varied sentence structure, and authentic expression.'
    },
    professional: {
      instruction: 'Rewrite the text with a professional, business-appropriate tone suitable for workplace communication.',
      context: 'Use formal language, clear structure, and professional terminology.'
    },
    academic: {
      instruction: 'Rewrite the text with an academic, scholarly tone suitable for research papers and academic publications.',
      context: 'Use precise terminology, objective language, and proper academic conventions.'
    },
    friendly: {
      instruction: 'Rewrite the text with a friendly, conversational tone that feels warm and approachable.',
      context: 'Use casual language, contractions, and a welcoming style.'
    },
    business: {
      instruction: 'Rewrite the text with a formal business tone appropriate for corporate communications and proposals.',
      context: 'Use professional language, clear business terminology, and persuasive elements.'
    },
    technical: {
      instruction: 'Rewrite the text with clear technical language appropriate for documentation and technical writing.',
      context: 'Use precise technical terminology, clear explanations, and structured format.'
    },
    simple: {
      instruction: 'Simplify the text to make it easier to understand for a general audience.',
      context: 'Use simple words, shorter sentences, and clear explanations.'
    },
    expanded: {
      instruction: 'Expand the text with more detail, examples, and elaboration to provide comprehensive coverage.',
      context: 'Add relevant details, examples, and explanations to enhance understanding.'
    },
    concise: {
      instruction: 'Make the text more concise and to the point while preserving key information.',
      context: 'Remove redundancy, use efficient phrasing, and focus on essential information.'
    }
  },

  // Document Review Prompts
  review: {
    general: {
      instruction: 'Review the document for grammar, spelling, readability, and overall writing quality.',
      criteria: [
        'Grammar and spelling errors',
        'Readability issues',
        'Vocabulary improvements',
        'Passive voice usage',
        'Sentence structure',
        'Paragraph organization',
        'Overall flow and coherence',
        'Writing quality score (1-10)'
      ]
    },
    academic: {
      instruction: 'Review the academic document for scholarly standards, citations, and academic writing conventions.',
      criteria: [
        'Academic tone and style',
        'Citation formatting',
        'Argument structure',
        'Evidence quality',
        'Scholarly vocabulary',
        'Objectivity and bias',
        'Research methodology',
        'Academic integrity'
      ]
    },
    business: {
      instruction: 'Review the business document for professional standards, clarity, and effectiveness.',
      criteria: [
        'Professional tone',
        'Clarity and conciseness',
        'Business terminology',
        'Persuasiveness',
        'Structure and formatting',
        'Call to action',
        'Audience appropriateness',
        'Brand consistency'
      ]
    }
  },

  // Code Analysis Prompts
  code: {
    explanation: {
      instruction: 'Explain what this code does in clear, simple terms.',
      output: ['Purpose', 'Key components', 'Data flow', 'Dependencies']
    },
    review: {
      instruction: 'Review the code for quality, best practices, and potential improvements.',
      criteria: [
        'Code explanation',
        'Potential bugs or issues',
        'Refactoring suggestions',
        'Naming improvements',
        'Performance recommendations',
        'Best practices violations',
        'Documentation needs',
        'Security concerns'
      ]
    },
    refactor: {
      instruction: 'Suggest refactoring improvements to make the code more maintainable and efficient.',
      focus: [
        'Code duplication',
        'Complexity reduction',
        'Design patterns',
        'SOLID principles',
        'Error handling',
        'Code organization'
      ]
    },
    optimize: {
      instruction: 'Suggest performance optimizations for this code.',
      focus: [
        'Time complexity',
        'Space complexity',
        'Algorithm efficiency',
        'Resource usage',
        'Caching opportunities',
        'Parallelization potential'
      ]
    }
  },

  // Resume Optimization Prompts
  resume: {
    ats: {
      instruction: 'Optimize the resume for ATS (Applicant Tracking Systems) to improve parsing and ranking.',
      focus: [
        'Keyword optimization',
        'Format compatibility',
        'Section organization',
        'Standardized headings',
        'Avoid parsing issues'
      ]
    },
    content: {
      instruction: 'Enhance the resume content for maximum impact and effectiveness.',
      focus: [
        'Achievement quantification',
        'Action verbs',
        'Skills section',
        'Summary optimization',
        'Experience descriptions',
        'Education presentation',
        'Projects and certifications'
      ]
    },
    structure: {
      instruction: 'Improve the resume structure and organization.',
      focus: [
        'Section ordering',
        'Information hierarchy',
        'White space usage',
        'Consistency',
        'Professional formatting'
      ]
    }
  },

  // Documentation Prompts
  documentation: {
    readme: {
      instruction: 'Review and improve the README documentation.',
      criteria: [
        'Clarity and completeness',
        'Installation instructions',
        'Usage examples',
        'Project description',
        'Contributing guidelines',
        'License information',
        'Structure and organization'
      ]
    },
    api: {
      instruction: 'Review API documentation for completeness and clarity.',
      criteria: [
        'Endpoint descriptions',
        'Parameter documentation',
        'Response examples',
        'Error handling',
        'Authentication details',
        'Rate limiting',
        'Code examples'
      ]
    },
    technical: {
      instruction: 'Review technical documentation for accuracy and completeness.',
      criteria: [
        'Technical accuracy',
        'Completeness',
        'Clarity',
        'Code examples',
        'Diagrams and visuals',
        'Troubleshooting',
        'Best practices'
      ]
    }
  },

  // Explanation Prompts
  explain: {
    concept: {
      instruction: 'Explain this concept in clear, accessible terms.',
      structure: [
        'Simple definition',
        'Key components',
        'How it works',
        'Why it matters',
        'Real-world examples',
        'Common misconceptions'
      ]
    },
    code: {
      instruction: 'Explain this code snippet in detail.',
      structure: [
        'Overall purpose',
        'Line-by-line explanation',
        'Key functions/methods',
        'Data structures used',
        'Algorithm/approach',
        'Potential edge cases'
      ]
    },
    process: {
      instruction: 'Explain this process step by step.',
      structure: [
        'Overview',
        'Step-by-step breakdown',
        'Key decision points',
        'Inputs and outputs',
        'Potential issues',
        'Best practices'
      ]
    }
  }
};

// Generate prompt based on workflow and options
const generatePrompt = (workflow, type, options = {}) => {
  const workflowPrompts = PROMPTS[workflow];
  if (!workflowPrompts) {
    throw new Error(`Unknown workflow: ${workflow}`);
  }

  const typePrompt = workflowPrompts[type];
  if (!typePrompt) {
    throw new Error(`Unknown type ${type} in workflow ${workflow}`);
  }

  let prompt = typePrompt.instruction;

  // Add context if available
  if (typePrompt.context) {
    prompt += `\n\nContext: ${typePrompt.context}`;
  }

  // Add criteria if available
  if (typePrompt.criteria) {
    prompt += '\n\nReview criteria:\n';
    typePrompt.criteria.forEach((criterion, index) => {
      prompt += `${index + 1}. ${criterion}\n`;
    });
  }

  // Add focus areas if available
  if (typePrompt.focus) {
    prompt += '\n\nFocus areas:\n';
    typePrompt.focus.forEach((area, index) => {
      prompt += `${index + 1}. ${area}\n`;
    });
  }

  // Add output structure if available
  if (typePrompt.output) {
    prompt += '\n\nInclude in your response:\n';
    typePrompt.output.forEach((item, index) => {
      prompt += `${index + 1}. ${item}\n`;
    });
  }

  // Add structure if available
  if (typePrompt.structure) {
    prompt += '\n\nStructure your response as:\n';
    typePrompt.structure.forEach((item, index) => {
      prompt += `${index + 1}. ${item}\n`;
    });
  }

  // Add custom options
  if (options.customInstruction) {
    prompt += `\n\nAdditional instruction: ${options.customInstruction}`;
  }

  return prompt;
};

// Get available workflows
const getWorkflows = () => {
  return Object.keys(PROMPTS);
};

// Get available types for a workflow
const getTypes = (workflow) => {
  const workflowPrompts = PROMPTS[workflow];
  if (!workflowPrompts) {
    return [];
  }
  return Object.keys(workflowPrompts);
};

module.exports = {
  PROMPTS,
  generatePrompt,
  getWorkflows,
  getTypes
};

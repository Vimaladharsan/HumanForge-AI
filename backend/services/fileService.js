const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const marked = require('marked');
const yaml = require('js-yaml');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = (process.env.ALLOWED_EXTENSIONS || 
      '.pdf,.doc,.docx,.txt,.md,.rtf,.odt,.java,.py,.js,.ts,.c,.cpp,.cs,.go,.rs,.php,.sql,.html,.css,.json,.xml,.yaml,.yml')
      .split(',');
    
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${ext} is not allowed`), false);
    }
  }
});

// Supported file formats
const SUPPORTED_FORMATS = {
  documents: ['.pdf', '.doc', '.docx', '.txt', '.md', '.rtf', '.odt'],
  code: ['.java', '.py', '.js', '.ts', '.c', '.cpp', '.cs', '.go', '.rs', '.php', '.sql', '.html', '.css'],
  data: ['.json', '.xml', '.yaml', '.yml'],
  project: ['.md', 'README.md', 'Dockerfile', 'package.json', 'pom.xml', 'requirements.txt']
};

// Detect file type
const detectFileType = (filename, content = '') => {
  const ext = path.extname(filename).toLowerCase();
  
  // Check if it's a document
  if (SUPPORTED_FORMATS.documents.includes(ext)) {
    return { category: 'document', type: ext.replace('.', ''), extension: ext };
  }
  
  // Check if it's code
  if (SUPPORTED_FORMATS.code.includes(ext)) {
    return { category: 'code', type: ext.replace('.', ''), extension: ext };
  }
  
  // Check if it's data
  if (SUPPORTED_FORMATS.data.includes(ext)) {
    return { category: 'data', type: ext.replace('.', ''), extension: ext };
  }
  
  // Check if it's a project file
  if (filename.toLowerCase() === 'readme.md' || filename.toLowerCase() === 'dockerfile' || 
      filename === 'package.json' || filename === 'pom.xml' || filename === 'requirements.txt') {
    return { category: 'project', type: filename, extension: ext };
  }
  
  // Default to text
  return { category: 'text', type: 'txt', extension: ext };
};

// Parse file content based on type
const parseFileContent = async (filePath, fileType) => {
  const ext = fileType.extension.toLowerCase();
  
  try {
    switch (ext) {
      case '.pdf':
        const pdfBuffer = await fs.readFile(filePath);
        const pdfData = await pdfParse(pdfBuffer);
        return pdfData.text;
      
      case '.doc':
      case '.docx':
        const docBuffer = await fs.readFile(filePath);
        const docResult = await mammoth.extractRawText({ buffer: docBuffer });
        return docResult.value;
      
      case '.md':
      case '.markdown':
        const mdContent = await fs.readFile(filePath, 'utf-8');
        // Return markdown as-is, but also provide HTML version
        return {
          markdown: mdContent,
          html: marked.parse(mdContent)
        };
      
      case '.yaml':
      case '.yml':
        const yamlContent = await fs.readFile(filePath, 'utf-8');
        const yamlData = yaml.load(yamlContent);
        return {
          yaml: yamlContent,
          parsed: yamlData
        };
      
      case '.json':
        const jsonContent = await fs.readFile(filePath, 'utf-8');
        const jsonData = JSON.parse(jsonContent);
        return {
          json: jsonContent,
          parsed: jsonData
        };
      
      case '.xml':
        return await fs.readFile(filePath, 'utf-8');
      
      case '.txt':
      case '.rtf':
      case '.odt':
      case '.java':
      case '.py':
      case '.js':
      case '.ts':
      case '.c':
      case '.cpp':
      case '.cs':
      case '.go':
      case '.rs':
      case '.php':
      case '.sql':
      case '.html':
      case '.css':
      default:
        return await fs.readFile(filePath, 'utf-8');
    }
  } catch (error) {
    throw new Error(`Failed to parse ${ext} file: ${error.message}`);
  }
};

// Process uploaded file
const processFile = async (req) => {
  return new Promise((resolve, reject) => {
    upload.single('file')(req, null, async (err) => {
      if (err) {
        return reject(err);
      }
      
      try {
        const file = req.file;
        const fileType = detectFileType(file.originalname);
        
        // Parse file content based on type
        const content = await parseFileContent(file.path, fileType);
        
        // Handle different content return types
        let textContent = content;
        let metadata = {};
        
        if (typeof content === 'object' && content !== null && !Array.isArray(content)) {
          if (content.markdown) {
            textContent = content.markdown;
            metadata.html = content.html;
          } else if (content.yaml) {
            textContent = content.yaml;
            metadata.parsed = content.parsed;
          } else if (content.json) {
            textContent = content.json;
            metadata.parsed = content.parsed;
          }
        }
        
        resolve({
          fileId: uuidv4(),
          originalName: file.originalname,
          filename: file.filename,
          path: file.path,
          size: file.size,
          mimetype: file.mimetype,
          fileType: fileType,
          content: textContent,
          metadata: metadata
        });
      } catch (error) {
        reject(error);
      }
    });
  });
};

// Get supported formats
const getSupportedFormats = () => {
  return SUPPORTED_FORMATS;
};

module.exports = {
  upload,
  processFile,
  parseFileContent,
  detectFileType,
  getSupportedFormats
};

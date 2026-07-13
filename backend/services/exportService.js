const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const PDFDocument = require('pdfkit');
const officegen = require('officegen');

const exportsDir = path.join(__dirname, '../exports');

// Ensure exports directory exists
fs.ensureDirSync(exportsDir);

// Export document to different formats
const exportDocument = async (content, format, filename) => {
  try {
    const exportId = uuidv4();
    const baseFilename = filename.replace(/\.[^/.]+$/, '');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const exportFilename = `${baseFilename}_exported_${timestamp}.${format}`;
    const exportPath = path.join(exportsDir, exportFilename);
    
    let result;
    
    switch (format.toLowerCase()) {
      case 'pdf':
        result = await exportToPDF(content, exportPath);
        break;
      case 'docx':
        result = await exportToDOCX(content, exportPath);
        break;
      case 'md':
      case 'markdown':
        result = await exportToMarkdown(content, exportPath);
        break;
      case 'txt':
        result = await exportToTXT(content, exportPath);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
    
    return {
      exportId,
      filename: exportFilename,
      path: exportPath,
      format: format,
      size: (await fs.stat(exportPath)).size,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Export failed: ${error.message}`);
  }
};

// Export to PDF
const exportToPDF = async (content, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(outputPath);
      
      doc.pipe(stream);
      
      doc.fontSize(12).text(content, {
        align: 'left',
        lineGap: 6
      });
      
      doc.end();
      
      stream.on('finish', () => resolve(outputPath));
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

// Export to DOCX
const exportToDOCX = async (content, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      const docx = officegen('docx');
      
      const out = fs.createWriteStream(outputPath);
      docx.generate(out);
      
      const pObj = docx.createP();
      pObj.addText(content);
      
      out.on('finish', () => resolve(outputPath));
      out.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

// Export to Markdown
const exportToMarkdown = async (content, outputPath) => {
  await fs.writeFile(outputPath, content, 'utf-8');
  return outputPath;
};

// Export to TXT
const exportToTXT = async (content, outputPath) => {
  await fs.writeFile(outputPath, content, 'utf-8');
  return outputPath;
};

module.exports = {
  exportDocument
};

const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const PDFDocument = require('pdfkit');
const officegen = require('officegen');

const exportsDir = path.join(__dirname, '../exports');

// Ensure exports directory exists
fs.ensureDirSync(exportsDir);

// Export document to different formats
const exportDocument = async (content, format, filename, options = {}) => {
  try {
    const exportId = uuidv4();
    const baseFilename = filename.replace(/\.[^/.]+$/, '');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const exportFilename = `${baseFilename}_exported_${timestamp}.${format}`;
    const exportPath = path.join(exportsDir, exportFilename);
    
    let result;
    
    switch (format.toLowerCase()) {
      case 'pdf':
        result = await exportToPDF(content, exportPath, options);
        break;
      case 'docx':
        result = await exportToDOCX(content, exportPath, options);
        break;
      case 'md':
      case 'markdown':
        result = await exportToMarkdown(content, exportPath, options);
        break;
      case 'txt':
        result = await exportToTXT(content, exportPath, options);
        break;
      case 'html':
        result = await exportToHTML(content, exportPath, options);
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
      createdAt: new Date().toISOString(),
      options: options
    };
  } catch (error) {
    throw new Error(`Export failed: ${error.message}`);
  }
};

// Export to PDF
const exportToPDF = async (content, outputPath, options = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: options.pageSize || 'A4',
        margins: {
          top: options.marginTop || 50,
          bottom: options.marginBottom || 50,
          left: options.marginLeft || 50,
          right: options.marginRight || 50
        }
      });
      const stream = fs.createWriteStream(outputPath);
      
      doc.pipe(stream);
      
      // Add title if provided
      if (options.title) {
        doc.fontSize(16).font('Helvetica-Bold').text(options.title, { align: 'center' });
        doc.moveDown();
      }
      
      // Add content
      doc.fontSize(options.fontSize || 12).font('Helvetica').text(content, {
        align: options.align || 'left',
        lineGap: options.lineGap || 6
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
const exportToDOCX = async (content, outputPath, options = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const docx = officegen('docx');
      
      // Set document properties
      docx.creator = options.creator || 'HumanForge AI';
      docx.title = options.title || 'Exported Document';
      docx.subject = options.subject || 'Document Export';
      
      const out = fs.createWriteStream(outputPath);
      docx.generate(out);
      
      // Add title if provided
      if (options.title) {
        const titleP = docx.createP();
        titleP.addText(options.title, { bold: true, size: 24 });
        docx.createP();
      }
      
      // Add content
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
const exportToMarkdown = async (content, outputPath, options = {}) => {
  let markdownContent = content;
  
  // Add title if provided
  if (options.title) {
    markdownContent = `# ${options.title}\n\n${content}`;
  }
  
  // Add metadata if provided
  if (options.metadata) {
    const metadataStr = Object.entries(options.metadata)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    markdownContent = `---\n${metadataStr}\n---\n\n${markdownContent}`;
  }
  
  await fs.writeFile(outputPath, markdownContent, 'utf-8');
  return outputPath;
};

// Export to TXT
const exportToTXT = async (content, outputPath, options = {}) => {
  let textContent = content;
  
  // Add title if provided
  if (options.title) {
    textContent = `${options.title}\n${'='.repeat(options.title.length)}\n\n${content}`;
  }
  
  await fs.writeFile(outputPath, textContent, 'utf-8');
  return outputPath;
};

// Export to HTML
const exportToHTML = async (content, outputPath, options = {}) => {
  const title = options.title || 'Exported Document';
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: ${options.fontFamily || 'Arial, sans-serif'};
            max-width: ${options.maxWidth || '800px'};
            margin: 0 auto;
            padding: 20px;
            line-height: ${options.lineHeight || '1.6'};
        }
        h1 {
            color: ${options.headingColor || '#333'};
            border-bottom: 2px solid ${options.borderColor || '#eee'};
            padding-bottom: 10px;
        }
        p {
            margin-bottom: 1em;
        }
    </style>
</head>
<body>
    <h1>${title}</h1>
    <div class="content">
        ${content.replace(/\n/g, '<br>\n')}
    </div>
</body>
</html>`;
  
  await fs.writeFile(outputPath, htmlContent, 'utf-8');
  return outputPath;
};

module.exports = {
  exportDocument
};

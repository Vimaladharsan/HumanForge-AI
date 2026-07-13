# HumanForge AI

## Universal AI Document & Code Intelligence Platform

### **Tagline**

**"Analyze. Improve. Humanize. Review. Explain."**

---

## Overview

HumanForge AI is an AI-powered workspace designed to intelligently analyze, improve, review, and optimize documents and source code. Unlike conventional AI humanizers that focus only on rewriting text, HumanForge AI provides a complete document and code intelligence platform capable of processing multiple file formats through specialized AI workflows.

The platform combines AI-powered writing assistance, document analysis, code review, repository evaluation, writing analytics, explainable AI, and version management into a single modern workspace.

---

## Features

### Universal File Support

**Documents:**
- PDF, DOC, DOCX, TXT, Markdown, RTF, ODT

**Source Code:**
- Java, Python, JavaScript, TypeScript, C/C++, C#, Go, Rust, PHP, SQL, HTML/CSS

**Data Files:**
- JSON, XML, YAML

**Project Files:**
- README.md, Dockerfile, package.json, pom.xml, requirements.txt

### AI Humanizer

- Natural rewriting
- Professional tone
- Academic tone
- Friendly tone
- Business tone
- Technical tone
- Simplification
- Expansion
- Concise rewriting

### AI Document Review

- Grammar analysis
- Readability analysis
- Vocabulary improvement
- Passive voice detection
- Structural review
- Writing quality score
- AI-generated suggestions

### AI Code Intelligence

- Code explanation
- Refactoring suggestions
- Bug detection
- Naming improvements
- Performance recommendations
- Documentation generation
- Best practice analysis

### Resume & Documentation Intelligence

- ATS optimization
- Resume enhancement
- README review
- Project documentation analysis
- Technical report review

### Writing Analytics

- Word count
- Reading time
- Readability score
- Vocabulary diversity
- Sentence statistics
- Paragraph analysis
- Repeated words
- Long sentence detection
- Sentiment analysis
- Grade level assessment

### Explainable AI

Every AI-generated suggestion includes a clear explanation of:
- What changed
- Why it changed
- Expected improvement

### Version History

- Document revision history
- Side-by-side comparison
- Restore previous versions
- Change tracking
- Diff visualization

### Export

Export processed content as:
- PDF
- DOCX
- Markdown
- TXT
- HTML

---

## Tech Stack

### Backend
- Node.js
- Express.js
- Gemini AI API
- PDF parsing (pdf-parse)
- DOCX parsing (mammoth)
- Markdown processing (marked)
- YAML processing (js-yaml)

### Frontend
- Angular 17
- TypeScript
- Angular Material
- SCSS

---

## Project Structure

```
HumanForge-AI/
├── backend/
│   ├── controllers/      # API route handlers
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic
│   │   ├── aiService.js
│   │   ├── analyticsService.js
│   │   ├── exportService.js
│   │   ├── fileService.js
│   │   ├── promptEngine.js
│   │   └── versionService.js
│   ├── uploads/         # Temporary file storage
│   ├── versions/        # Version history storage
│   ├── exports/         # Exported files storage
│   ├── server.js        # Express server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── features/    # Feature modules
│   │   │   │   ├── dashboard/
│   │   │   │   ├── upload/
│   │   │   │   ├── humanize/
│   │   │   │   ├── review/
│   │   │   │   ├── code-analysis/
│   │   │   │   ├── resume/
│   │   │   │   ├── analytics/
│   │   │   │   ├── versions/
│   │   │   │   └── export/
│   │   │   ├── app.component.ts
│   │   │   ├── app.module.ts
│   │   │   └── app-routing.module.ts
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.scss
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Gemini API Key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Add your Gemini API key to `.env`:
```
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

5. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the Angular development server:
```bash
npm start
```

The frontend will run on `http://localhost:4200`

---

## API Endpoints

### File Operations
- `POST /api/files/upload` - Upload and process file
- `POST /api/files/detect-type` - Detect file type
- `GET /api/files/supported-formats` - Get supported formats

### AI Operations
- `POST /api/ai/humanize` - Humanize text with specified tone
- `POST /api/ai/review` - Review document
- `POST /api/ai/analyze-code` - Analyze code
- `POST /api/ai/optimize-resume` - Optimize resume
- `POST /api/ai/explain` - Explain content
- `POST /api/ai/review-documentation` - Review documentation

### Analytics
- `POST /api/analytics/analyze` - Analyze document
- `POST /api/analytics/code-metrics` - Get code metrics

### Version History
- `POST /api/versions/save` - Save version
- `GET /api/versions/:documentId` - Get versions
- `GET /api/versions/:documentId/compare/:version1/:version2` - Compare versions
- `POST /api/versions/:documentId/restore/:versionId` - Restore version

### Export
- `POST /api/export/export` - Export document

---

## Usage

1. **Upload a File**: Use the upload feature to upload documents or code files
2. **Select Feature**: Choose from AI Humanizer, Document Review, Code Analysis, etc.
3. **Process Content**: The AI will process your content using specialized workflows
4. **Review Results**: View AI suggestions with explanations
5. **Export**: Export your processed content in various formats

---

## Development

### Backend Development
```bash
cd backend
npm run dev  # Run with nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm start    # Start Angular dev server
```

---

## Future Roadmap

### Version 2
- Repository ZIP analysis
- AI Chat Assistant
- Repository health reports
- Documentation generation
- Multi-AI provider support

### Version 3
- Authentication
- Cloud synchronization
- Workflow automation
- Plugin architecture
- Team collaboration

### Version 4
- GitHub Integration
- Google Drive Integration
- Notion Integration
- VS Code Extension
- Browser Extension

---

## License

MIT License

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## Support

For issues and questions, please open an issue on GitHub.

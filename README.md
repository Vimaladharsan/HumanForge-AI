# HumanForge AI

## Universal AI Document & Code Intelligence Platform

### **Tagline**

**"Analyze. Improve. Humanize. Review. Explain."**

---

## Overview

HumanForge AI is an AI-powered workspace designed to intelligently analyze, improve, review, and optimize documents and source code. Unlike conventional AI humanizers that focus only on rewriting text, HumanForge AI provides a complete document and code intelligence platform capable of processing multiple file formats through specialized AI workflows.

It supports **two AI providers** — Google **Gemini** and Anthropic **Claude** — selectable per request, and combines AI-powered writing assistance, document analysis, code review, writing analytics, explainable AI, saved history, and version management into a single modern workspace with light and dark themes.

---

## Features

### Multi-Provider AI

- Switch between **Gemini** (`gemini-2.0-flash`) and **Claude** (`claude-sonnet-5`) per request via an in-app toggle
- Default provider configurable through `DEFAULT_AI_PROVIDER`
- A shared provider-agnostic service layer means every feature works with either model

### User Accounts & Saved History

- Register / log in with JWT-based authentication (passwords hashed with bcrypt)
- Every successful Humanize / Review / Code Analysis / Resume request is **auto-saved to your history** while logged in
- Browse, filter by feature, expand, and delete past results
- Anonymous use still works fully — history is simply an opt-in benefit of signing in

### AI Humanizer

- Natural, Professional, Academic, Friendly, Business, Technical tones
- Simplify, Expand, and Concise rewriting
- **AI-detection score** showing how "human" the text reads, before and after

### AI Document Review

- Grammar, readability, and vocabulary analysis
- Passive voice detection and structural review
- Writing quality scoring with AI-generated suggestions

### AI Code Intelligence

- Code explanation, refactoring, and optimization
- Bug detection, naming, and best-practice analysis
- Multi-language support (JS/TS, Python, Java, C/C++, C#, Go, Rust, PHP, SQL, and more)

### Resume & Documentation Intelligence

- ATS optimization and content enhancement
- README / project documentation review

### Follow-up Chat

- After any AI result, ask follow-up questions in a conversation thread that keeps the original context

### File Upload

- Upload documents and code (PDF, DOCX, TXT, MD, and many code/data formats)
- Extracted text is previewed, then routed straight into any AI feature with one click

### Writing & Code Analytics

- **Document metrics:** word/sentence/paragraph counts, reading time, Flesch readability, grade level, vocabulary diversity, sentiment, passive voice, complex/repeated words
- **Code metrics:** lines of code, comment ratio, functions/classes, cyclomatic complexity, maintainability index, nesting depth, duplicate lines, TODOs
- Runs locally — no AI call required

### Version History

- Save content snapshots per document ID
- List, view, compare (word/line diff), and restore versions

### Export

- Export processed content as **PDF, DOCX, Markdown, TXT, or HTML**, then download the generated file

### Dark Mode

- Light/dark toggle in the sidebar, persisted to `localStorage`
- Defaults to your operating-system color-scheme preference on first visit

---

## Tech Stack

### Backend
- Node.js + Express.js
- Google Gemini API (`@google/generative-ai`) and Anthropic Claude API (`@anthropic-ai/sdk`)
- SQLite via **sql.js** (WebAssembly — no native build step required) for users & history
- JWT auth (`jsonwebtoken`) with bcrypt password hashing (`bcryptjs`)
- File parsing: pdf-parse, mammoth (DOCX), marked (Markdown), js-yaml
- Export: pdfkit (PDF), officegen (DOCX)

### Frontend
- Angular 17 + TypeScript
- Angular Material (light & dark theming)
- SCSS with CSS custom-property theme tokens

---

## Project Structure

```
HumanForge-AI/
├── backend/
│   ├── controllers/         # API route handlers (ai, auth, history, file, analytics, version, export)
│   ├── routes/              # API route definitions + index.js aggregator
│   ├── middleware/
│   │   └── authMiddleware.js # requireAuth / optionalAuth (JWT)
│   ├── services/            # Business logic
│   │   ├── aiService.js         # Provider-agnostic Gemini + Claude calls, chat
│   │   ├── aiDetectionService.js # Heuristic "humanness" scoring
│   │   ├── authService.js
│   │   ├── historyService.js
│   │   ├── analyticsService.js
│   │   ├── exportService.js
│   │   ├── fileService.js
│   │   ├── promptEngine.js
│   │   └── versionService.js
│   ├── db/
│   │   └── database.js      # sql.js init + persistence helpers
│   ├── data/                # SQLite database file (gitignored)
│   ├── uploads/             # Temporary upload storage (gitignored)
│   ├── versions/            # Version history storage (gitignored)
│   ├── exports/             # Generated export files (gitignored)
│   ├── server.js            # Express entry point (initializes DB, then listens)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── features/    # Lazy-loaded feature modules
│   │   │   │   ├── dashboard/  upload/  humanize/  review/
│   │   │   │   ├── code-analysis/  resume/  analytics/
│   │   │   │   ├── versions/  export/  history/  auth/
│   │   │   ├── services/    # ai, auth, auth.interceptor, theme, file,
│   │   │   │                #   analytics, version, export, history
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts
│   │   │   ├── shared/      # markdown-to-html pipe (sanitized)
│   │   │   ├── app.component.ts
│   │   │   ├── app.module.ts
│   │   │   └── app-routing.module.ts
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.scss      # Material light+dark themes + theme tokens
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm
- A Gemini API key and/or an Anthropic (Claude) API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies (no native toolchain needed — SQLite runs via WebAssembly):
```bash
npm install
```

3. Create the environment file:
```bash
cp .env.example .env
```

4. Fill in `.env`:
```
PORT=5000
NODE_ENV=development

# Provide at least one of these:
GEMINI_API_KEY=your_gemini_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# 'gemini' or 'claude'
DEFAULT_AI_PROVIDER=gemini

# Secret used to sign auth tokens — use a long random string
JWT_SECRET=change_this_to_a_random_secret
```

5. Start the backend server:
```bash
npm start        # or: npm run dev  (nodemon auto-reload)
```

The backend runs on `http://localhost:5000`.

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

The frontend runs on `http://localhost:4200`.

---

## API Endpoints

### Health
- `GET /api/health` — Service health check

### Authentication
- `POST /api/auth/register` — Create an account (returns user + JWT)
- `POST /api/auth/login` — Log in (returns user + JWT)
- `GET /api/auth/me` — Current user (requires `Authorization: Bearer <token>`)

### AI Operations
> These accept an optional `provider` field (`"gemini"` | `"claude"`). If a valid token is sent, successful results are auto-saved to history.
- `POST /api/ai/humanize` — Humanize text with a tone (+ before/after detection scores)
- `POST /api/ai/review` — Review a document
- `POST /api/ai/analyze-code` — Analyze code
- `POST /api/ai/optimize-resume` — Optimize a resume
- `POST /api/ai/explain` — Explain content
- `POST /api/ai/review-documentation` — Review documentation
- `POST /api/ai/detect` — Score text for AI "humanness"
- `POST /api/ai/chat` — Follow-up chat within a result's context

### History (require auth)
- `GET /api/history` — List saved results (optional `?feature=` filter)
- `GET /api/history/:id` — Get one saved result
- `DELETE /api/history/:id` — Delete a saved result

### File Operations
- `POST /api/files/upload` — Upload and extract file content
- `POST /api/files/detect-type` — Detect file type
- `GET /api/files/supported-formats` — List supported formats

### Analytics
- `POST /api/analytics/analyze` — Document writing metrics
- `POST /api/analytics/code-metrics` — Code metrics

### Version History
- `POST /api/versions/save` — Save a version
- `GET /api/versions/:documentId` — List versions
- `GET /api/versions/:documentId/version/:versionId` — Get one version's content
- `GET /api/versions/:documentId/compare/:version1/:version2` — Compare two versions
- `POST /api/versions/:documentId/restore/:versionId` — Restore a version

### Export
- `POST /api/export/export` — Generate an export file (PDF/DOCX/MD/TXT/HTML)
- `GET /api/export/download/:filename` — Download a generated file

---

## Usage

1. **(Optional) Sign in** to have your results saved to History
2. **Upload a file** (or paste content directly into a feature)
3. **Pick a provider** (Gemini or Claude) and a feature — Humanizer, Review, Code Analysis, Resume, Analytics
4. **Review results** with explanations, detection scores, and follow-up chat
5. **Save versions**, revisit your **History**, or **Export** the output

---

## Development

### Backend
```bash
cd backend
npm run dev   # nodemon auto-reload
npm test      # Jest
```

### Frontend
```bash
cd frontend
npm start     # Angular dev server
npm test      # Karma/Jasmine
```

---

## Roadmap

Recently shipped: multi-provider AI (Gemini + Claude), follow-up chat, AI-detection scoring, user accounts & saved history, dark mode, and fully wired Upload / Analytics / Versions / Export pages.

Planned next:
- Streaming (token-by-token) AI responses
- Mobile-responsive sidebar
- Rate limiting on AI endpoints
- Repository ZIP analysis & health reports
- Integrations (GitHub, Google Drive) and a VS Code extension

---

## License

MIT License

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## Support

For issues and questions, please open an issue on GitHub.

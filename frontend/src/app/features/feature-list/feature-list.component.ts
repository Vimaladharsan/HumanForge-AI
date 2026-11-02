import { Component } from '@angular/core';

interface Feature {
  icon: string;
  title: string;
  blurb: string;
  points: string[];
  link: string;
  cta: string;
}

@Component({
  selector: 'app-feature-list',
  templateUrl: './feature-list.component.html',
  styleUrls: ['./feature-list.component.scss']
})
export class FeatureListComponent {
  readonly features: Feature[] = [
    {
      icon: 'auto_fix_high',
      title: 'AI Humanizer',
      blurb: 'Turn flat, machine-generated prose into writing that sounds like a person wrote it.',
      points: [
        'Nine tones: natural, professional, academic, friendly, business, technical, simple, expanded, concise',
        'AI-detection score computed before and after, so you can see the shift',
        'Heuristic signals explain why a passage reads as machine-written'
      ],
      link: '/humanize',
      cta: 'Open Humanizer'
    },
    {
      icon: 'rate_review',
      title: 'Document Review',
      blurb: 'A structural edit pass across grammar, clarity, vocabulary and flow.',
      points: [
        'Grammar, readability and vocabulary analysis',
        'Passive-voice detection and structural critique',
        'Quality scoring with concrete, actionable suggestions'
      ],
      link: '/review',
      cta: 'Review a document'
    },
    {
      icon: 'code',
      title: 'Code Intelligence',
      blurb: 'Read, refactor and interrogate source code across thirteen-plus languages.',
      points: [
        'Explanation, refactoring and optimisation passes',
        'Bug detection, naming and best-practice review',
        'JS/TS, Python, Java, C/C++, C#, Go, Rust, PHP, SQL, HTML, CSS and more'
      ],
      link: '/code-analysis',
      cta: 'Analyze code'
    },
    {
      icon: 'work',
      title: 'Resume & Docs',
      blurb: 'Tighten a resume for applicant tracking systems, or audit project documentation.',
      points: [
        'ATS optimisation and content enhancement',
        'README and project-documentation review',
        'Rewrites framed around impact rather than duties'
      ],
      link: '/resume',
      cta: 'Optimize a resume'
    },
    {
      icon: 'insights',
      title: 'Writing & Code Analytics',
      blurb: 'Hard numbers on your text and your code — computed locally, with no AI call.',
      points: [
        'Word, sentence and paragraph counts, reading time, Flesch score, grade level',
        'Vocabulary diversity, sentiment, passive voice, complex and repeated words',
        'Code: lines, comment ratio, cyclomatic complexity, maintainability, nesting depth, TODOs'
      ],
      link: '/analytics',
      cta: 'Run the metrics'
    },
    {
      icon: 'history',
      title: 'Version History',
      blurb: 'Snapshot any document and move freely between drafts.',
      points: [
        'Save content snapshots against a document ID',
        'Compare any two versions with word-level and line-level diffs',
        'Restore an earlier draft without losing the newer one'
      ],
      link: '/versions',
      cta: 'Open versions'
    },
    {
      icon: 'download',
      title: 'Upload & Export',
      blurb: 'Bring work in from anywhere and take the result out in whatever format you need.',
      points: [
        'Upload PDF, DOCX, TXT, Markdown and many code and data formats',
        'Text is extracted, previewed, then routed into any workflow in one click',
        'Export as PDF, DOCX, Markdown, plain text or a styled HTML page'
      ],
      link: '/upload',
      cta: 'Upload a file'
    }
  ];

  readonly platform = [
    { icon: 'forum', title: 'Contextual follow-up chat', copy: 'Every result opens into a conversation that remembers the original analysis.' },
    { icon: 'manage_search', title: 'Saved history', copy: 'Signed-in runs are stored automatically, filterable by workflow, and re-openable.' },
    { icon: 'dark_mode', title: 'Light and dark themes', copy: 'A full dual-theme design system that follows your OS preference on first visit.' },
    { icon: 'lock', title: 'JWT authentication', copy: 'Passwords hashed with bcrypt; anonymous use stays fully available without an account.' }
  ];
}

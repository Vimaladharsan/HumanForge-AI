import { Component } from '@angular/core';

interface Highlight {
  icon: string;
  title: string;
  copy: string;
  link: string;
}

interface Step {
  n: string;
  title: string;
  copy: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  readonly highlights: Highlight[] = [
    {
      icon: 'auto_fix_high',
      title: 'AI Humanizer',
      copy: 'Rewrite stiff, machine-sounding text in nine tones — and see the AI-detection score move before and after.',
      link: '/humanize'
    },
    {
      icon: 'code',
      title: 'Code Intelligence',
      copy: 'Explain, refactor, and bug-hunt across 13+ languages, with cyclomatic complexity and maintainability metrics.',
      link: '/code-analysis'
    },
    {
      icon: 'rate_review',
      title: 'Document Review',
      copy: 'Grammar, readability, passive voice, and structure — scored, explained, and turned into concrete suggestions.',
      link: '/review'
    },
    {
      icon: 'insights',
      title: 'Offline Analytics',
      copy: 'Flesch readability, grade level, vocabulary diversity, and code metrics computed locally — no AI call needed.',
      link: '/analytics'
    },
    {
      icon: 'history',
      title: 'Versions & Diffs',
      copy: 'Snapshot any document, compare revisions word-by-word and line-by-line, and restore an earlier draft.',
      link: '/versions'
    },
    {
      icon: 'download',
      title: 'Export Anywhere',
      copy: 'Ship the finished result as PDF, DOCX, Markdown, plain text, or a styled HTML page.',
      link: '/export'
    }
  ];

  readonly steps: Step[] = [
    { n: '01', title: 'Bring your content', copy: 'Paste text or upload a PDF, DOCX, Markdown or source file — the text is extracted for you.' },
    { n: '02', title: 'Pick a workflow', copy: 'Humanize, review, analyze code, optimize a resume, or run the local metrics engine.' },
    { n: '03', title: 'Refine and ship', copy: 'Ask follow-up questions in context, save a version, then export in the format you need.' }
  ];

  readonly stats = [
    { value: '7', label: 'AI workflows' },
    { value: '20+', label: 'File formats' },
    { value: '13+', label: 'Languages' },
    { value: '5', label: 'Export targets' }
  ];
}

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'markdownToHtml' })
export class MarkdownToHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | null): SafeHtml {
    if (!value) return '';
    let html = value
      // Code blocks
      .replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Headers
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      // Bullet lists
      .replace(/^\s*[-*] (.+)$/gm, '<li>$1</li>')
      // Numbered lists
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      // Wrap consecutive <li> in <ul>
      .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
      // Line breaks (paragraphs)
      .replace(/\n{2,}/g, '</p><p>')
      .replace(/\n/g, '<br/>');
    html = `<p>${html}</p>`;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

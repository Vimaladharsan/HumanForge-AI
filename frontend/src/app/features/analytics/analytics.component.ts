import { Component } from '@angular/core';
import { AnalyticsService, DocumentAnalytics, CodeMetrics } from '../../services/analytics.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent {
  mode: 'document' | 'code' = 'document';
  content = '';
  selectedLanguage = 'javascript';
  loading = false;
  error = '';
  docResult: DocumentAnalytics | null = null;
  codeResult: CodeMetrics | null = null;

  readonly languages = [
    'javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'csharp',
    'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'sql', 'html', 'css', 'other'
  ];

  constructor(private analyticsService: AnalyticsService) {}

  setMode(mode: 'document' | 'code'): void {
    this.mode = mode;
    this.docResult = null;
    this.codeResult = null;
    this.error = '';
  }

  analyze(): void {
    if (!this.content.trim()) return;
    this.loading = true;
    this.error = '';
    this.docResult = null;
    this.codeResult = null;

    if (this.mode === 'document') {
      this.analyticsService.analyzeDocument(this.content, 'text').subscribe({
        next: (res) => {
          this.loading = false;
          if (res.success) this.docResult = res.data;
          else this.error = res.error || 'Analysis failed';
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.error || 'Analysis failed. Check that the backend is running.';
        }
      });
    } else {
      this.analyticsService.getCodeMetrics(this.content, this.selectedLanguage).subscribe({
        next: (res) => {
          this.loading = false;
          if (res.success) this.codeResult = res.data;
          else this.error = res.error || 'Analysis failed';
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.error || 'Analysis failed. Check that the backend is running.';
        }
      });
    }
  }

  readabilityLabel(score: number): string {
    if (score >= 90) return 'Very Easy';
    if (score >= 70) return 'Easy';
    if (score >= 60) return 'Standard';
    if (score >= 50) return 'Fairly Difficult';
    if (score >= 30) return 'Difficult';
    return 'Very Difficult';
  }

  sentimentColor(sentiment: string): string {
    if (sentiment === 'positive') return '#4caf50';
    if (sentiment === 'negative') return '#f44336';
    return '#9e9e9e';
  }
}

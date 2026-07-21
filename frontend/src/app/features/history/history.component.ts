import { Component, OnInit } from '@angular/core';
import { HistoryEntry, HistoryService } from '../../services/history.service';

const FEATURE_LABELS: Record<string, string> = {
  'humanize': 'AI Humanizer',
  'review': 'Document Review',
  'code-analysis': 'Code Analysis',
  'resume': 'Resume Optimizer',
};

const FEATURE_ICONS: Record<string, string> = {
  'humanize': 'edit',
  'review': 'rate_review',
  'code-analysis': 'code',
  'resume': 'work',
};

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  entries: HistoryEntry[] = [];
  loading = true;
  error = '';
  selectedFeature = 'all';
  expandedId: number | null = null;

  readonly filters = [
    { value: 'all', label: 'All' },
    { value: 'humanize', label: 'Humanizer' },
    { value: 'review', label: 'Review' },
    { value: 'code-analysis', label: 'Code' },
    { value: 'resume', label: 'Resume' },
  ];

  constructor(private historyService: HistoryService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    const feature = this.selectedFeature === 'all' ? undefined : this.selectedFeature;
    this.historyService.list(feature).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) this.entries = res.data;
        else this.error = res.error || 'Failed to load history';
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Failed to load history';
      }
    });
  }

  setFilter(value: string): void {
    this.selectedFeature = value;
    this.load();
  }

  toggle(id: number): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  remove(id: number, event: Event): void {
    event.stopPropagation();
    this.historyService.delete(id).subscribe(() => {
      this.entries = this.entries.filter(e => e.id !== id);
    });
  }

  featureLabel(feature: string): string {
    return FEATURE_LABELS[feature] || feature;
  }

  featureIcon(feature: string): string {
    return FEATURE_ICONS[feature] || 'article';
  }

  summary(entry: HistoryEntry): string {
    switch (entry.feature) {
      case 'humanize': return entry.input.text?.slice(0, 100) || '';
      case 'review': return entry.input.content?.slice(0, 100) || '';
      case 'code-analysis': return entry.input.code?.slice(0, 100) || '';
      case 'resume': return entry.input.content?.slice(0, 100) || '';
      default: return '';
    }
  }

  outputText(entry: HistoryEntry): string {
    switch (entry.feature) {
      case 'humanize': return entry.output.humanizedText || '';
      case 'review': return entry.output.review || '';
      case 'code-analysis': return entry.output.analysis || '';
      case 'resume': return entry.output.optimization || '';
      default: return '';
    }
  }

  inputText(entry: HistoryEntry): string {
    switch (entry.feature) {
      case 'humanize': return entry.input.text || '';
      case 'review': return entry.input.content || '';
      case 'code-analysis': return entry.input.code || '';
      case 'resume': return entry.input.content || '';
      default: return '';
    }
  }
}

import { Component } from '@angular/core';
import { ExportService, ExportResult } from '../../services/export.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent {

  content = '';
  filename = 'my-document';
  title = '';
  selectedFormat = 'pdf';
  exporting = false;
  error = '';
  result: ExportResult | null = null;

  readonly formats = [
    { value: 'pdf', label: 'PDF' },
    { value: 'docx', label: 'Word (DOCX)' },
    { value: 'md', label: 'Markdown' },
    { value: 'txt', label: 'Plain Text' },
    { value: 'html', label: 'HTML' },
  ];

  constructor(private exportService: ExportService) {}

  export(): void {
    if (!this.content.trim() || !this.filename.trim()) return;
    this.exporting = true;
    this.error = '';
    this.result = null;

    const options = this.title.trim() ? { title: this.title } : {};
    this.exportService.exportDocument(this.content, this.selectedFormat, this.filename, options).subscribe({
      next: (res) => {
        this.exporting = false;
        if (res.success) {
          this.result = res.data;
        } else {
          this.error = res.error || 'Export failed';
        }
      },
      error: (err) => {
        this.exporting = false;
        this.error = err.error?.error || 'Export failed. Check that the backend is running.';
      }
    });
  }

  downloadUrl(): string {
    return this.result ? this.exportService.downloadUrl(this.result.filename) : '';
  }
}

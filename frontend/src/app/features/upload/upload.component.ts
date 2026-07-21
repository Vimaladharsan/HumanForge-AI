import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FileService, UploadResult } from '../../services/file.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  selectedFile: File | null = null;
  uploading = false;
  error = '';
  result: UploadResult | null = null;

  constructor(private fileService: FileService, private router: Router) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.selectedFile = file;
    this.result = null;
    this.error = '';
    if (file) this.upload(file);
  }

  upload(file: File): void {
    this.uploading = true;
    this.error = '';
    this.fileService.upload(file).subscribe({
      next: (res) => {
        this.uploading = false;
        if (res.success) {
          this.result = res.data;
        } else {
          this.error = res.error || 'Upload failed';
        }
      },
      error: (err) => {
        this.uploading = false;
        this.error = err.error?.error || 'Upload failed. Check that the backend is running.';
      }
    });
  }

  sendTo(feature: 'humanize' | 'review' | 'code-analysis' | 'resume'): void {
    if (!this.result) return;
    this.router.navigateByUrl(`/${feature}`, { state: { content: this.result.content } });
  }

  reset(): void {
    this.selectedFile = null;
    this.result = null;
    this.error = '';
  }
}

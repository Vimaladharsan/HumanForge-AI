import { Component } from '@angular/core';
import { VersionService, VersionSummary, VersionComparison } from '../../services/version.service';

@Component({
  selector: 'app-versions',
  templateUrl: './versions.component.html',
  styleUrls: ['./versions.component.scss']
})
export class VersionsComponent {
  documentId = '';
  content = '';
  label = '';
  versions: VersionSummary[] = [];
  loading = false;
  saving = false;
  error = '';

  viewingContent: string | null = null;
  viewingVersionId: string | null = null;

  compareSelection: string[] = [];
  comparison: VersionComparison | null = null;

  constructor(private versionService: VersionService) {}

  generateId(): void {
    this.documentId = 'doc-' + Math.random().toString(36).slice(2, 10);
    this.versions = [];
    this.comparison = null;
    this.viewingContent = null;
  }

  loadVersions(): void {
    if (!this.documentId.trim()) return;
    this.loading = true;
    this.error = '';
    this.versionService.listVersions(this.documentId).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) this.versions = res.data;
        else this.error = res.error || 'Failed to load versions';
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Failed to load versions. Check that the backend is running.';
      }
    });
  }

  saveVersion(): void {
    if (!this.documentId.trim() || !this.content.trim()) return;
    this.saving = true;
    this.error = '';
    this.versionService.saveVersion(this.documentId, this.content, this.label ? { label: this.label } : {}).subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success) {
          this.label = '';
          this.loadVersions();
        } else {
          this.error = res.error || 'Failed to save version';
        }
      },
      error: (err) => {
        this.saving = false;
        this.error = err.error?.error || 'Failed to save version.';
      }
    });
  }

  viewVersion(versionId: string): void {
    this.versionService.getVersion(this.documentId, versionId).subscribe({
      next: (res) => {
        if (res.success) {
          this.viewingContent = res.data.content;
          this.viewingVersionId = versionId;
        }
      }
    });
  }

  toggleCompareSelection(versionId: string): void {
    const idx = this.compareSelection.indexOf(versionId);
    if (idx >= 0) {
      this.compareSelection.splice(idx, 1);
    } else {
      if (this.compareSelection.length >= 2) this.compareSelection.shift();
      this.compareSelection.push(versionId);
    }
  }

  compare(): void {
    if (this.compareSelection.length !== 2) return;
    this.comparison = null;
    this.versionService.compareVersions(this.documentId, this.compareSelection[0], this.compareSelection[1]).subscribe({
      next: (res) => {
        if (res.success) this.comparison = res.data;
      }
    });
  }

  restore(versionId: string): void {
    this.versionService.restoreVersion(this.documentId, versionId).subscribe({
      next: (res) => {
        if (res.success) this.loadVersions();
      }
    });
  }
}

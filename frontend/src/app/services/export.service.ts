import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from './auth.service';

export interface ExportResult {
  exportId: string;
  filename: string;
  format: string;
  size: number;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ExportService {
  private readonly base = 'http://localhost:5000/api/export';

  constructor(private http: HttpClient) {}

  exportDocument(content: string, format: string, filename: string, options: any = {}): Observable<ApiResponse<ExportResult>> {
    return this.http.post<ApiResponse<ExportResult>>(`${this.base}/export`, { content, format, filename, options });
  }

  downloadUrl(filename: string): string {
    return `${this.base}/download/${encodeURIComponent(filename)}`;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from './auth.service';

export interface VersionSummary {
  versionId: string;
  timestamp: string;
  metadata: any;
}

export interface VersionDetail {
  versionId: string;
  documentId: string;
  content: string;
  timestamp: string;
  metadata: any;
}

export interface VersionComparison {
  version1: { id: string; timestamp: string; metadata: any };
  version2: { id: string; timestamp: string; metadata: any };
  summary: { totalWords: number; addedWords: number; removedWords: number; changePercentage: number; contentChanged: boolean };
  lineChanges: { added: any[]; removed: any[]; modified: any[] };
  wordChanges: { added: string[]; removed: string[] };
}

@Injectable({ providedIn: 'root' })
export class VersionService {
  private readonly base = 'http://localhost:5000/api/versions';

  constructor(private http: HttpClient) {}

  saveVersion(documentId: string, content: string, metadata: any = {}): Observable<ApiResponse<VersionDetail>> {
    return this.http.post<ApiResponse<VersionDetail>>(`${this.base}/save`, { documentId, content, metadata });
  }

  listVersions(documentId: string): Observable<ApiResponse<VersionSummary[]>> {
    return this.http.get<ApiResponse<VersionSummary[]>>(`${this.base}/${documentId}`);
  }

  getVersion(documentId: string, versionId: string): Observable<ApiResponse<VersionDetail>> {
    return this.http.get<ApiResponse<VersionDetail>>(`${this.base}/${documentId}/version/${versionId}`);
  }

  compareVersions(documentId: string, v1: string, v2: string): Observable<ApiResponse<VersionComparison>> {
    return this.http.get<ApiResponse<VersionComparison>>(`${this.base}/${documentId}/compare/${v1}/${v2}`);
  }

  restoreVersion(documentId: string, versionId: string): Observable<ApiResponse<VersionDetail>> {
    return this.http.post<ApiResponse<VersionDetail>>(`${this.base}/${documentId}/restore/${versionId}`, {});
  }
}

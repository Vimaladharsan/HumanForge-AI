import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from './auth.service';

export interface HistoryEntry {
  id: number;
  feature: 'humanize' | 'review' | 'code-analysis' | 'resume';
  provider: string;
  input: any;
  output: any;
  metadata: any;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private readonly base = 'http://localhost:5000/api/history';

  constructor(private http: HttpClient) {}

  list(feature?: string): Observable<ApiResponse<HistoryEntry[]>> {
    const url = feature ? `${this.base}?feature=${feature}` : this.base;
    return this.http.get<ApiResponse<HistoryEntry[]>>(url);
  }

  get(id: number): Observable<ApiResponse<HistoryEntry>> {
    return this.http.get<ApiResponse<HistoryEntry>>(`${this.base}/${id}`);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.base}/${id}`);
  }
}

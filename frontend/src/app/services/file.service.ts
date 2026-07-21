import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from './auth.service';

export interface FileType {
  category: string;
  type: string;
  extension: string;
}

export interface UploadResult {
  fileId: string;
  originalName: string;
  filename: string;
  size: number;
  mimetype: string;
  fileType: FileType;
  content: string;
  metadata: any;
}

@Injectable({ providedIn: 'root' })
export class FileService {
  private readonly base = 'http://localhost:5000/api/files';

  constructor(private http: HttpClient) {}

  upload(file: File): Observable<ApiResponse<UploadResult>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<UploadResult>>(`${this.base}/upload`, formData);
  }
}

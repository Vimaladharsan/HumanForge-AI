import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface DetectionScore {
  humanScore: number;
  aiScore: number;
  signals: { label: string; impact: number; examples?: string[] }[];
}

export interface HumanizeResult {
  originalText: string;
  humanizedText: string;
  tone: string;
  detectionScores: { before: DetectionScore; after: DetectionScore };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResult {
  reply: string;
  history: ChatMessage[];
}

@Injectable({ providedIn: 'root' })
export class AiService {
  private readonly base = 'http://localhost:5000/api/ai';

  constructor(private http: HttpClient) {}

  humanize(text: string, tone: string): Observable<ApiResponse<HumanizeResult>> {
    return this.http.post<ApiResponse<HumanizeResult>>(`${this.base}/humanize`, { text, tone });
  }

  detectAI(text: string): Observable<ApiResponse<DetectionScore>> {
    return this.http.post<ApiResponse<DetectionScore>>(`${this.base}/detect`, { text });
  }

  reviewDocument(content: string, fileType: string, reviewType: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.base}/review`, { content, fileType, reviewType });
  }

  analyzeCode(code: string, language: string, analysisType: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.base}/analyze-code`, { code, language, analysisType });
  }

  optimizeResume(content: string, optimizationType: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.base}/optimize-resume`, { content, optimizationType });
  }

  chat(message: string, history: ChatMessage[], context: string): Observable<ApiResponse<ChatResult>> {
    return this.http.post<ApiResponse<ChatResult>>(`${this.base}/chat`, { message, history, context });
  }
}

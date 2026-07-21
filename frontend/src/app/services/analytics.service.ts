import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from './auth.service';

export interface DocumentAnalytics {
  wordCount: number;
  characterCount: number;
  sentenceCount: number;
  paragraphCount: number;
  readingTime: number;
  readabilityScore: number;
  vocabularyDiversity: number;
  averageSentenceLength: number;
  averageWordLength: number;
  averageSyllablesPerWord: number;
  repeatedWords: { word: string; count: number }[];
  longSentences: { index: number; text: string; wordCount: number }[];
  shortSentences: { index: number; text: string; wordCount: number }[];
  passiveVoiceCount: number;
  complexWords: { word: string; syllables: number }[];
  sentiment: string;
  gradeLevel: number;
}

export interface CodeMetrics {
  language: string;
  linesOfCode: number;
  blankLines: number;
  commentLines: number;
  codeLines: number;
  functions: number;
  classes: number;
  interfaces: number;
  averageLineLength: number;
  maxLineLength: number;
  complexity: number;
  maintainabilityIndex: number;
  codeDensity: number;
  nestingDepth: number;
  duplicateLines: number;
  imports: number;
  TODOs: number;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly base = 'http://localhost:5000/api/analytics';

  constructor(private http: HttpClient) {}

  analyzeDocument(content: string, fileType: string): Observable<ApiResponse<DocumentAnalytics>> {
    return this.http.post<ApiResponse<DocumentAnalytics>>(`${this.base}/analyze`, { content, fileType });
  }

  getCodeMetrics(code: string, language: string): Observable<ApiResponse<CodeMetrics>> {
    return this.http.post<ApiResponse<CodeMetrics>>(`${this.base}/code-metrics`, { code, language });
  }
}

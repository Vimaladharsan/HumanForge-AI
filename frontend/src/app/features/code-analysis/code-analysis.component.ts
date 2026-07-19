import { Component } from '@angular/core';
import { AiService, AiProvider, ChatMessage } from '../../services/ai.service';

@Component({
  selector: 'app-code-analysis',
  templateUrl: './code-analysis.component.html',
  styleUrls: ['./code-analysis.component.scss']
})
export class CodeAnalysisComponent {
  code = '';
  selectedLanguage = 'javascript';
  selectedAnalysisType = 'review';
  selectedProvider: AiProvider = 'gemini';
  loading = false;
  error = '';
  result: string | null = null;
  provider: AiProvider | null = null;

  chatHistory: ChatMessage[] = [];
  chatInput = '';
  chatLoading = false;
  showChat = false;

  readonly languages = [
    'javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'csharp',
    'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'sql', 'html', 'css', 'other'
  ];

  readonly analysisTypes = [
    { value: 'review', label: 'Code Review' },
    { value: 'explanation', label: 'Explain Code' },
    { value: 'refactor', label: 'Refactor' },
    { value: 'optimize', label: 'Optimize' },
  ];

  constructor(private aiService: AiService) {}

  analyze(): void {
    if (!this.code.trim()) return;
    this.loading = true;
    this.error = '';
    this.result = null;
    this.showChat = false;
    this.chatHistory = [];

    this.aiService.analyzeCode(this.code, this.selectedLanguage, this.selectedAnalysisType, this.selectedProvider).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.result = res.data.analysis;
          this.provider = res.data.provider;
        } else {
          this.error = res.error || 'Something went wrong';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Request failed. Check that the backend is running.';
      }
    });
  }

  copyResult(): void {
    if (this.result) navigator.clipboard.writeText(this.result);
  }

  sendChat(): void {
    const msg = this.chatInput.trim();
    if (!msg || !this.result) return;
    this.chatLoading = true;
    const context = `Code (${this.selectedLanguage}):\n\`\`\`\n${this.code}\n\`\`\`\n\nAnalysis:\n${this.result}`;
    this.chatHistory = [...this.chatHistory, { role: 'user', content: msg }];
    this.chatInput = '';

    this.aiService.chat(msg, this.chatHistory.slice(0, -1), context, this.selectedProvider).subscribe({
      next: (res) => {
        this.chatLoading = false;
        if (res.success) this.chatHistory = res.data.history;
      },
      error: () => {
        this.chatLoading = false;
        this.chatHistory = [...this.chatHistory, { role: 'assistant', content: 'Chat request failed.' }];
      }
    });
  }
}

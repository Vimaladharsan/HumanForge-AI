import { Component, OnInit } from '@angular/core';
import { AiService, AiProvider, HumanizeResult, ChatMessage } from '../../services/ai.service';

@Component({
  selector: 'app-humanize',
  templateUrl: './humanize.component.html',
  styleUrls: ['./humanize.component.scss']
})
export class HumanizeComponent implements OnInit {
  inputText = '';
  selectedTone = 'professional';
  selectedProvider: AiProvider = 'gemini';
  loading = false;
  error = '';
  result: HumanizeResult | null = null;

  // Chat
  chatHistory: ChatMessage[] = [];
  chatInput = '';
  chatLoading = false;
  showChat = false;

  readonly tones = [
    { value: 'natural', label: 'Natural' },
    { value: 'professional', label: 'Professional' },
    { value: 'academic', label: 'Academic' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'business', label: 'Business' },
    { value: 'technical', label: 'Technical' },
    { value: 'simple', label: 'Simple' },
    { value: 'expanded', label: 'Expanded' },
    { value: 'concise', label: 'Concise' },
  ];

  constructor(private aiService: AiService) {}

  ngOnInit(): void {
    const content = history.state?.content;
    if (content) this.inputText = content;
  }

  humanize(): void {
    if (!this.inputText.trim()) return;
    this.loading = true;
    this.error = '';
    this.result = null;
    this.showChat = false;
    this.chatHistory = [];

    this.aiService.humanize(this.inputText, this.selectedTone, this.selectedProvider).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.result = res.data;
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
    if (this.result?.humanizedText) {
      navigator.clipboard.writeText(this.result.humanizedText);
    }
  }

  openChat(): void {
    this.showChat = true;
  }

  sendChat(): void {
    const msg = this.chatInput.trim();
    if (!msg || !this.result) return;

    this.chatLoading = true;
    const context = `Original text:\n${this.result.originalText}\n\nHumanized text:\n${this.result.humanizedText}`;
    this.chatHistory = [...this.chatHistory, { role: 'user', content: msg }];
    this.chatInput = '';

    this.aiService.chat(msg, this.chatHistory.slice(0, -1), context, this.selectedProvider).subscribe({
      next: (res) => {
        this.chatLoading = false;
        if (res.success) {
          this.chatHistory = res.data.history;
        }
      },
      error: () => {
        this.chatLoading = false;
        this.chatHistory = [...this.chatHistory, { role: 'assistant', content: 'Sorry, chat request failed.' }];
      }
    });
  }

  scoreColor(score: number): string {
    if (score >= 70) return '#4caf50';
    if (score >= 40) return '#ff9800';
    return '#f44336';
  }
}

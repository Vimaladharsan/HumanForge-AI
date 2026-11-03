import { Component, OnInit } from '@angular/core';
import { AiService, ChatMessage } from '../../services/ai.service';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent implements OnInit {
  content = '';
  selectedOptimizationType = 'content';
  loading = false;
  error = '';
  result: string | null = null;

  chatHistory: ChatMessage[] = [];
  chatInput = '';
  chatLoading = false;
  showChat = false;

  readonly optimizationTypes = [
    { value: 'content', label: 'Content & Impact' },
    { value: 'ats', label: 'ATS Optimization' },
    { value: 'structure', label: 'Structure & Format' },
  ];

  constructor(private aiService: AiService, private toast: ToastService) {}

  ngOnInit(): void {
    const content = history.state?.content;
    if (content) this.content = content;
  }

  optimize(): void {
    if (!this.content.trim()) return;
    this.loading = true;
    this.error = '';
    this.result = null;
    this.showChat = false;
    this.chatHistory = [];

    this.aiService.optimizeResume(this.content, this.selectedOptimizationType).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.result = res.data.optimization;
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
    if (this.result) this.toast.copy(this.result, 'Suggestions copied');
  }

  sendChat(): void {
    const msg = this.chatInput.trim();
    if (!msg || !this.result) return;
    this.chatLoading = true;
    const context = `Resume:\n${this.content}\n\nOptimization suggestions:\n${this.result}`;
    this.chatHistory = [...this.chatHistory, { role: 'user', content: msg }];
    this.chatInput = '';

    this.aiService.chat(msg, this.chatHistory.slice(0, -1), context).subscribe({
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

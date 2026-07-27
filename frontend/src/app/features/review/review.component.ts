import { Component, OnInit } from '@angular/core';
import { AiService, ChatMessage } from '../../services/ai.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  content = '';
  fileType = 'text';
  selectedReviewType = 'general';
  loading = false;
  error = '';
  result: string | null = null;

  chatHistory: ChatMessage[] = [];
  chatInput = '';
  chatLoading = false;
  showChat = false;

  readonly fileTypes = ['text', 'pdf', 'docx', 'markdown', 'rtf'];
  readonly reviewTypes = [
    { value: 'general', label: 'General Review' },
    { value: 'academic', label: 'Academic' },
    { value: 'business', label: 'Business' },
  ];

  constructor(private aiService: AiService) {}

  ngOnInit(): void {
    const content = history.state?.content;
    if (content) this.content = content;
  }

  review(): void {
    if (!this.content.trim()) return;
    this.loading = true;
    this.error = '';
    this.result = null;
    this.showChat = false;
    this.chatHistory = [];

    this.aiService.reviewDocument(this.content, this.fileType, this.selectedReviewType).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.result = res.data.review;
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
    const context = `Document (${this.fileType}):\n${this.content}\n\nReview:\n${this.result}`;
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

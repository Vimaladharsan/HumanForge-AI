import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownToHtmlPipe } from './markdown-to-html.pipe';

@NgModule({
  declarations: [MarkdownToHtmlPipe],
  imports: [CommonModule],
  exports: [MarkdownToHtmlPipe]
})
export class SharedModule {}

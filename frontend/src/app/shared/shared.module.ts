import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MarkdownToHtmlPipe } from './markdown-to-html.pipe';
import { RevealDirective } from './reveal.directive';
import { SkeletonComponent } from './skeleton.component';
import { EmptyStateComponent } from './empty-state.component';

const SHARED = [MarkdownToHtmlPipe, RevealDirective, SkeletonComponent, EmptyStateComponent];

@NgModule({
  declarations: [...SHARED],
  imports: [CommonModule, MatIconModule],
  exports: [...SHARED]
})
export class SharedModule {}

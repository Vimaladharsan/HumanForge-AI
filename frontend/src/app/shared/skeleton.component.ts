import { Component, Input } from '@angular/core';

/**
 * Shimmer placeholder shaped like the content that is loading.
 *
 * Shown instead of a bare spinner: a spinner says "something is happening",
 * a skeleton says "this is what is coming and roughly how much of it".
 */
@Component({
  selector: 'hf-skeleton',
  template: `
    <div class="hf-skeleton-block" role="status" [attr.aria-label]="label">
      <div class="hf-skeleton-line" *ngFor="let w of widths" [style.width]="w"></div>
      <span class="hf-skeleton-caption">{{ label }}</span>
    </div>
  `
})
export class SkeletonComponent {
  /** Number of shimmer lines to draw. */
  @Input() lines = 5;
  @Input() label = 'Generating…';

  /**
   * Ragged line widths read as prose; uniform ones read as a loading bar.
   * Deterministic rather than random so the block does not reflow on
   * change detection.
   */
  private static readonly PATTERN = ['100%', '94%', '97%', '88%', '92%', '75%', '96%', '82%'];

  get widths(): string[] {
    const out: string[] = [];
    for (let i = 0; i < this.lines; i++) {
      // Last line short, like the end of a paragraph.
      out.push(i === this.lines - 1 ? '58%' : SkeletonComponent.PATTERN[i % SkeletonComponent.PATTERN.length]);
    }
    return out;
  }
}

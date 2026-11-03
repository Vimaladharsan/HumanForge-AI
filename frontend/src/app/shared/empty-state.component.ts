import { Component, Input } from '@angular/core';

/**
 * The "nothing here yet" panel.
 *
 * Replaces the grey italic sentence that used to sit in empty result panels:
 * an icon gives the panel a focal point, and the hint line tells the user what
 * to do next instead of only stating that nothing has happened.
 */
@Component({
  selector: 'hf-empty-state',
  template: `
    <div class="hf-empty">
      <div class="hf-empty-icon"><mat-icon>{{ icon }}</mat-icon></div>
      <p class="hf-empty-title">{{ title }}</p>
      <p class="hf-empty-hint" *ngIf="hint">{{ hint }}</p>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() icon = 'auto_awesome';
  @Input() title = 'Nothing here yet';
  @Input() hint = '';
}

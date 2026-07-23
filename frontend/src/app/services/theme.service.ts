import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const THEME_KEY = 'hf_theme';
const DARK_CLASS = 'dark-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private isDarkSubject = new BehaviorSubject<boolean>(false);
  readonly isDark$ = this.isDarkSubject.asObservable();

  constructor() {
    this.apply(this.resolveInitial());
  }

  private resolveInitial(): boolean {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    // No stored preference — fall back to the OS setting.
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  }

  private apply(isDark: boolean): void {
    document.body.classList.toggle(DARK_CLASS, isDark);
    this.isDarkSubject.next(isDark);
  }

  get isDark(): boolean {
    return this.isDarkSubject.value;
  }

  toggle(): void {
    const next = !this.isDark;
    localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
    this.apply(next);
  }
}

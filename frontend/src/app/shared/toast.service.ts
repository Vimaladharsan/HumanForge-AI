import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Brief confirmations for actions that otherwise give no feedback.
 *
 * Copying to the clipboard used to succeed silently, which reads as a dead
 * button — the user clicks again, unsure whether anything happened.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  show(message: string, duration = 2200): void {
    this.snackBar.open(message, '', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: 'hf-snack'
    });
  }

  /**
   * Copies text and confirms it. The clipboard API rejects when the document
   * is not focused or permission is refused, so failure is reported rather
   * than swallowed into a toast that claims success.
   */
  async copy(text: string, label = 'Copied to clipboard'): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this.show(label);
    } catch {
      this.show('Could not copy — your browser blocked clipboard access', 3200);
    }
  }
}

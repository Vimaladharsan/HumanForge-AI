import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./auth.component.scss']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  submit(): void {
    if (!this.name || !this.email || !this.password) return;
    this.loading = true;
    this.error = '';

    this.authService.register(this.email, this.password, this.name).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.error = res.error || 'Registration failed';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Registration failed. Check that the backend is running.';
      }
    });
  }
}

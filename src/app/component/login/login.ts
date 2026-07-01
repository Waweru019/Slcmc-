import { Component, signal, inject } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api'; // Ensure this path matches your project structure

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html'
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private apiService = inject(ApiService); // ⚡ Injected ApiService here

  loginForm: FormGroup;
  errorMessage = signal<string>(''); 
  isSubmitting = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage.set(''); 

    const payload = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    // 🚀 Shifted to ApiService
  this.apiService.login(payload).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          // 💾 Save session details safely
          localStorage.setItem('userId', res.user_id.toString());
          localStorage.setItem('firstName', res.first_name);
          localStorage.setItem('role', res.role);
          localStorage.setItem('status', res.account_status || res.status_field || 'pending');

          //  FIX: Give the browser 150ms to settle the session cookie before changing routes
          setTimeout(() => {
            if (res.role === 'admin'|| res.role === 'Guest') {
              this.router.navigate(['/admin']); 
            } else {
              // Option A: Clean router navigation
              this.router.navigate(['/portal']).then(() => {
                // If the components are still racing, uncomment the line below to force a hard sync:
                // window.location.reload();
              });
            }
          }, 150);

        } else {
          this.errorMessage.set(res.message || 'Invalid email or password');
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Unable to connect to server');
        this.isSubmitting = false;
      }
    });
  }
}
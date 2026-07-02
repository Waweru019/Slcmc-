import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // 1. Import the Router service
import { ApiService } from '@core/services/api';

export interface PasswordResetLog {
  id: number;
  email: string;
  token: string;
  status: 'Active' | 'Used' | 'Expired';
  created_at: string;
  expires_at: string;
}

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-passowrd.html',
})
export class ForgotPassword {
  private apiService = inject(ApiService);
  private router = inject(Router); // 2. Inject the Router service dynamically

  // UI Flow Tracking State Flags
  currentStep = signal<'request' | 'reset'>('request');
  emailInput = signal('');

  resetForm = {
    token: '',
    newPassword: '',
    confirmPassword: ''
  };

  sendResetLink(): void {
    if (!this.emailInput().trim()) {
      alert('Please enter your registered email address.');
      return;
    }

    const payload = { email: this.emailInput().trim() };

    this.apiService.forgotPassword(payload).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          alert('Verification checks completed. Please check your email or enter your token directly here.');
          if (res.debug_token) {
            this.resetForm.token = res.debug_token;
            console.log("DEV DEBUG ASSIST TOKEN:", res.debug_token);
          }
          this.currentStep.set('reset'); 
        } else {
          alert('Error processing request: ' + res.message);
        }
      },
      error: (err) => console.error('Failed to dispatch recovery request string:', err)
    });
  }

  executePasswordReset(): void {
    if (!this.resetForm.token || !this.resetForm.newPassword) {
      alert('All form entries are mandatory.');
      return;
    }

    if (this.resetForm.newPassword.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    if (this.resetForm.newPassword !== this.resetForm.confirmPassword) {
      alert('Your structural password inputs do not match.');
      return;
    }

    const payload = {
      token: this.resetForm.token,
      new_password: this.resetForm.newPassword
    };

    this.apiService.resetPassword(payload).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          alert('Password successfully changed! You can now log into your dashboard profile.');
          
          // Reset form data and steps
          this.currentStep.set('request');
          this.resetForm = { token: '', newPassword: '', confirmPassword: '' };
          this.emailInput.set('');

          // 3. Smoothly redirect the user back to your system's login panel route
          this.router.navigate(['/login']);
        } else {
          alert('Update rejected: ' + res.message);
        }
      },
      error: (err) => console.error('System validation interface failure:', err)
    });
  }
}
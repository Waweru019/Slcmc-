import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api'; 

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './verify-otp.html',
  styleUrl: './verify-otp.css',
})
export class OtpVerify implements OnInit, OnDestroy {
  userId!: number;
  otpCode: string = ''; // Replaced array tracking with a single string
  
  // Timer States
  timeLeft: number = 120; // 2 minutes
  timerInterval: any;
  canResend: boolean = false;

  constructor(
    private apiService: ApiService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = +params['user_id'];
      if (!this.userId) {
        alert('Invalid access scope. Redirecting to registration panel.');
        this.router.navigate(['/register']);
      }
    });

    this.startTimer();
  }

  startTimer() {
    this.timeLeft = 120;
    this.canResend = false;
    
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.canResend = true;
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const minsStr = mins < 10 ? '0' + mins : mins;
    const secsStr = secs < 10 ? '0' + secs : secs;
    return `${minsStr}:${secsStr}`;
  }

  // Sanitizes incoming string input data
  onOtpInput(event: any) {
    const inputVal = event.target.value;
    // Strip everything except numeric digits
    this.otpCode = inputVal.replace(/[^0-9]/g, '');

    // Optional: Auto-submit when user reaches 6 digits
    if (this.otpCode.length === 6) {
      this.submitOtp();
    }
  }

  submitOtp() {
    if (this.otpCode.length < 6) {
      alert('Please fill out all 6 digits.');
      return;
    }

    const payload = {
      user_id: this.userId,
      otp_code: this.otpCode
    };

    this.apiService.verifyOtp(payload).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          alert(response.message);
          this.router.navigate(['/login']);
        } else {
          alert(response.message);
        }
      },
      error: (err) => {
        console.error('Core API service transmission anomaly:', err);
        alert(err.error?.message || 'An unexpected verification error occurred.');
      }
    });
  }

  resendOtp() {
    if (!this.canResend) return;

    const payload = { user_id: this.userId };

    this.apiService.resendOtp(payload).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          alert('A brand new verification code has been dispatched.');
          this.otpCode = ''; // Clear input on resend
          this.startTimer();
        } else {
          alert(response.message);
        }
      },
      error: (err) => console.error(err)
    });
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}
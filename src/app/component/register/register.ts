import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '@core/services/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html'
})
export class Register implements OnInit {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);

  registerForm!: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      dob: ['', Validators.required],
      nationalId: ['', Validators.required],
      gender: ['', Validators.required],
      graduationClass: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{7,14}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/.*[0-9].*/)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload = {
      First_name: this.registerForm.value.fullName,
      Dob: this.registerForm.value.dob,
      id_no: this.registerForm.value.nationalId,
      Gender: this.registerForm.value.gender,
      Graduation_class: this.registerForm.value.graduationClass,
      Phone_number: this.registerForm.value.phoneNumber,
      Email: this.registerForm.value.email,
      Password: this.registerForm.value.password
    };

    this.apiService.registerAlumniUser(payload).subscribe({
      next: (response: any) => {
        this.successMessage = response.message || 'Account created successfully!';
        this.registerForm.reset();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'An error occurred during registration.';
        this.isSubmitting = false;
      }
    });
  }
}
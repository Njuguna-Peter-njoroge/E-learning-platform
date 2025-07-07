import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 class="text-xl font-bold text-center mb-4">Verify Your Email</h1>

        <form [formGroup]="verifyForm" (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label class="block mb-1 font-medium">Email Address</label>
            <input
              formControlName="email"
              type="email"
              class="w-full border border-gray-300 px-4 py-2 rounded-md"
              placeholder="Enter your email"
            />
          </div>

          <div class="mb-6">
            <label class="block mb-1 font-medium">Verification Code</label>
            <input
              formControlName="token"
              type="text"
              class="w-full border border-gray-300 px-4 py-2 rounded-md"
              placeholder="Enter verification token"
            />
          </div>

          <button
            type="submit"
            class="bg-orange-600 w-full text-white py-2 rounded-md hover:bg-orange-700 transition"
          >
            Verify Email
          </button>
        </form>

        <div *ngIf="message" class="mt-4 text-center text-green-600">
          {{ message }}
        </div>
        <div *ngIf="error" class="mt-4 text-center text-red-600">
          {{ error }}
        </div>
      </div>
    </div>
  `
})
export class VerifyEmailComponent {
  verifyForm: FormGroup;
  message = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.verifyForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      token: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.verifyForm.invalid) return;

    const { email, token } = this.verifyForm.value;

    this.http.post('http://localhost:3000/auth/verify-email', { email, token })
      .subscribe({
        next: () => {
          this.message = 'Email verified successfully!';
          this.error = '';
          setTimeout(() => this.router.navigate(['/tlogin']), 2000);
        },
        error: err => {
          this.error = err.error?.message || 'Verification failed';
          this.message = '';
        }
      });
  }
}

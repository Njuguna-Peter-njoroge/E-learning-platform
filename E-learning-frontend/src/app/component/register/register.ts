import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';  // Adjust path as needed

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-white rounded-xl">
      <div>
        <img src="assets/images/authimage.jpg" alt="Auth" class="w-[530px] h-[630px] rounded-xl brightness-50">
      </div>

      <div class="w-[530px] h-[630px]">
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="bg-white p-8 rounded-lg shadow-md h-[630px]">
          <h1 class="flex justify-center mt-4">Create Your Account</h1>
          <div class="flex justify-center mt-5 bg-orange-600 rounded-xl w-[300px]">
            <button routerLink="/tlogin">Login</button>
            <button routerLink="/tregister" class="active:border-black rounded-xl px-3 py-1">Register</button>
          </div>
          <h1 class="flex justify-center my-3">Gain skills, growth and competence</h1>

          <!-- Error Message Display -->
          <div *ngIf="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {{ errorMessage }}
          </div>

          <!-- Success Message Display -->
          <div *ngIf="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {{ successMessage }}
          </div>

          <div class="my-4">
            <label class="block mb-1 font-medium">Full Name</label>
            <input 
              formControlName="fullName" 
              type="text" 
              class="w-full border rounded-xl px-4 py-2 border-orange-600" 
              placeholder="Enter your full name" 
              [class.border-red-500]="isFieldInvalid('fullName')"
            />
            <div *ngIf="isFieldInvalid('fullName')" class="text-red-500 text-sm mt-1">
              Full name is required
            </div>
          </div>

          <div class="my-4">
            <label class="block mb-1 font-medium">Email Address</label>
            <input 
              formControlName="email" 
              type="email" 
              class="w-full border rounded-xl px-4 py-2 border-orange-600" 
              placeholder="Enter your email" 
              [class.border-red-500]="isFieldInvalid('email')"
            />
            <div *ngIf="isFieldInvalid('email')" class="text-red-500 text-sm mt-1">
              <span *ngIf="registerForm.get('email')?.errors?.['required']">Email is required</span>
              <span *ngIf="registerForm.get('email')?.errors?.['email']">Please enter a valid email address</span>
            </div>
          </div>

          <div class="my-4">
            <label class="block mb-1 font-medium">Password</label>
            <input 
              formControlName="password" 
              type="password" 
              class="w-full border rounded-xl px-4 py-2 border-orange-600" 
              placeholder="Enter password" 
              [class.border-red-500]="isFieldInvalid('password')"
            />
            <div *ngIf="isFieldInvalid('password')" class="text-red-500 text-sm mt-1">
              Password is required
            </div>
          </div>

          <div class="my-4">
            <label class="block mb-1 font-medium">Confirm Password</label>
            <input 
              formControlName="confirmPassword" 
              type="password" 
              class="w-full border rounded-xl px-4 py-2 border-orange-600" 
              placeholder="Confirm password" 
              [class.border-red-500]="isFieldInvalid('confirmPassword')"
            />
            <div *ngIf="isFieldInvalid('confirmPassword')" class="text-red-500 text-sm mt-1">
              <span *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">Please confirm your password</span>
              <span *ngIf="passwordMismatch">Passwords do not match</span>
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <button 
              type="submit" 
              class="bg-orange-600 text-white py-2 rounded-xl hover:bg-orange-700 transition w-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
              [disabled]="isLoading"
            >
              <span *ngIf="isLoading">Registering...</span>
              <span *ngIf="!isLoading">Register</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  passwordMismatch: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });

    // Watch for password changes to check for mismatch
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.checkPasswordMatch();
    });

    this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.checkPasswordMatch();
    });
  }

  checkPasswordMatch() {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    
    if (password && confirmPassword && password !== confirmPassword) {
      this.passwordMismatch = true;
      this.registerForm.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      this.passwordMismatch = false;
      if (this.registerForm.get('confirmPassword')?.errors?.['passwordMismatch']) {
        this.registerForm.get('confirmPassword')?.setErrors(null);
      }
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit() {
    this.clearMessages();
    
    // Mark all fields as touched to show validation errors
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });

    if (this.registerForm.invalid) {
      console.log('Form Invalid');
      return;
    }

    const { fullName, email, password, confirmPassword } = this.registerForm.value;

    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.isLoading = true;

    this.authService.register({ fullName, email, password }).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.isLoading = false;
        this.successMessage = 'Registration successful! Please check your email for verification.';
        
        // Clear the form
        this.registerForm.reset();
        
        // Update login status if user is automatically logged in
        this.authService.updateLoginStatus();
        
        // Redirect after a short delay
        setTimeout(() => {
          this.router.navigate(['/verify-email']);
        }, 2000);
      },
      error: (err) => {
        console.error('Registration failed', err);
        this.isLoading = false;
        
        // Handle different error types
        if (err.status === 409) {
          this.errorMessage = 'An account with this email already exists. Please try logging in instead.';
        } else if (err.status === 400) {
          this.errorMessage = err.error?.message || 'Invalid registration data. Please check your information.';
        } else if (err.status === 0) {
          this.errorMessage = 'Unable to connect to the server. Please check your internet connection.';
        } else {
          this.errorMessage = err.error?.message || 'Registration failed. Please try again later.';
        }
      }
    });
  }
}

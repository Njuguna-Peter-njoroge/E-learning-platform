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

          <div class="my-4">
            <label class="block mb-1 font-medium">Full Name</label>
            <input formControlName="fullName" type="text" class="w-full border rounded-xl px-4 py-2 border-orange-600" placeholder="Enter your full name" />
          </div>

          <div class="my-4">
            <label class="block mb-1 font-medium">Email Address</label>
            <input formControlName="email" type="email" class="w-full border rounded-xl px-4 py-2 border-orange-600" placeholder="Enter your email" />
          </div>

          <div class="my-4">
            <label class="block mb-1 font-medium">Password</label>
            <input formControlName="password" type="password" class="w-full border rounded-xl px-4 py-2 border-orange-600" placeholder="Enter password" />
          </div>

          <div class="my-4">
            <label class="block mb-1 font-medium">Confirm Password</label>
            <input formControlName="confirmPassword" type="password" class="w-full border rounded-xl px-4 py-2 border-orange-600" placeholder="Confirm password" />
          </div>

          <div class="flex justify-end mt-6">
            <button type="submit" class="bg-orange-600  text-white py-2 rounded-xl hover:bg-orange-700 transition w-[200px]" >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;

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
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      console.log('Form Invalid');
      return;
    }

    const { fullName, email, password, confirmPassword } = this.registerForm.value;

    if (password !== confirmPassword) {
      console.error('Passwords do not match');
      return;
    }

    this.authService.register({ fullName, email, password }).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.router.navigate(['/verify-email']); // or wherever you want to redirect
      },
      error: (err) => {
        console.error('Registration failed', err);
      }
    });
  }
}

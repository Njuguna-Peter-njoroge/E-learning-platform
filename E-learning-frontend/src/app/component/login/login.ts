import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center rounded-xl justify-center bg-white">
      <div>
        <img src="assets/images/authimage.jpg" alt="" class="w-[530px] h-[630px] rounded-xl brightness-50">
      </div>
      <div class="w-[530px] h-[630px]">
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="bg-white p-8 rounded-lg shadow-md h-[630px]">
        <h1 class="flex justify-center mt-4">Welcome to SkiBoost!</h1>
        <div class="flex justify-center mt-5 bg-orange-600 rounded-xl  w-[300px]">
          <button routerLink="/tlogin" class=" active:border-black rounded-xl px-3 py-1">login</button>
          <button routerLink="/tregister">Register</button>
        </div>
        <h1 class="flex justify-center my-3">Gain skills,growth and competence</h1>
        <div class="my-8">
          <label class="block mb-1 font-medium">Full Name</label>
          <input formControlName="fullName" type="text" class="w-full border rounded-xl px-4 py-2 border-orange-600" placeholder="Enter your full name" />
        </div>

        <div class="my-8">
          <label class="block mb-1 font-medium">Password</label>
          <input formControlName="password" type="password" class="w-full border rounded-xl px-4 py-2  border-orange-600" placeholder="Enter your password" />
        </div>

        <div class="flex justify-end mb-4">
          <a routerLink="/forgot-password" class="text-sm text-blue-600 hover:underline">Forgot Password?</a>
        </div>
        <div class="flex justify-end">
           <button type="submit" class=" bg-orange-600 text-white py-2 rounded-xl hover:bg-orange-700 transition w-[200px]">
          Login
          </button>
        </div>

      </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      fullName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form Data:', this.loginForm.value);
      // TODO: Send login request to backend
    } else {
      console.log('Form Invalid');
    }
  }
}

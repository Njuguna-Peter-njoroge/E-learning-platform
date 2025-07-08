import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  template: `
    <div class="flex justify-between items-center bg-white shadow-sm px-6 py-4">
      <div class="flex items-center">
        <h1 class="font-bold text-2xl text-orange-600">SB</h1>
      </div>
      
      <div class="flex items-center space-x-6">
        <button class="px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors" routerLink="/home">Home</button>
        <button class="px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors" routerLink="/courses">Courses</button>
        
        <!-- Role-based dashboard links -->
        <button *ngIf="isLoggedIn && isAdmin()" class="px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors" routerLink="/admindashboard">Admin Dashboard</button>
        <button *ngIf="isLoggedIn && isInstructor()" class="px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors" routerLink="/instructor-dashboard">Instructor Dashboard</button>
        <button *ngIf="isLoggedIn && isStudent()" class="px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors" routerLink="/dashboard">Student Dashboard</button>
        
        <button class="px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors" routerLink="/contact">Contact Us</button>
        <button class="px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors" routerLink="/about">About Us</button>
        
        <div class="flex items-center space-x-4 ml-6">
          <!-- Show Login/Register buttons when NOT logged in -->
          <div *ngIf="!isLoggedIn" class="flex items-center space-x-4">
            <button class="px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors" routerLink="/login">Login</button>
            <button class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors" routerLink="/register">Register</button>
          </div>
          
          <!-- Show User info and Logout when logged in -->
          <div *ngIf="isLoggedIn" class="flex items-center space-x-4">
            <span class="text-gray-700">{{ userEmail }}</span>
            <button 
              (click)="logout()" 
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class Header implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  userEmail: string = '';
  private subscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkLoginStatus();
    
    // Subscribe to login status changes
    this.subscription = this.authService.loginStatus$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      this.updateUserInfo();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  checkLoginStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.updateUserInfo();
  }

  updateUserInfo() {
    if (this.isLoggedIn) {
      // Get user email from localStorage
      const userData = localStorage.getItem('user_data');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          this.userEmail = user.email || user.fullName || 'User';
        } catch (e) {
          this.userEmail = 'User';
        }
      } else {
        // Fallback: try to get from token or other sources
        this.userEmail = 'User';
      }
    } else {
      this.userEmail = '';
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  // Helper methods for role checking
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isInstructor(): boolean {
    return this.authService.isInstructor();
  }

  isStudent(): boolean {
    return this.authService.isStudent();
  }
}

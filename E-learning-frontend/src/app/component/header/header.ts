import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  template: `
    <nav class="navbar">
      <div class="navbar-left">
        <h1 class="logo">SB</h1>
      </div>
      <div class="navbar-center">
        <button class="nav-link" routerLink="/home">Home</button>
        <button class="nav-link" routerLink="/courses">Courses</button>
        <button *ngIf="isLoggedIn && isAdmin()" class="nav-link" routerLink="/admindashboard">Admin Dashboard</button>
        <button *ngIf="isLoggedIn && isInstructor()" class="nav-link" routerLink="/instructor-dashboard">Instructor Dashboard</button>
        <button *ngIf="isLoggedIn && isStudent()" class="nav-link" routerLink="/dashboard">Student Dashboard</button>
        <button class="nav-link" routerLink="/contact">Contact Us</button>
        <button class="nav-link" routerLink="/about">About Us</button>
      </div>
      <div class="navbar-right">
        <!-- Show Login/Register buttons when NOT logged in -->
        <div *ngIf="!isLoggedIn" class="auth-buttons">
          <button class="nav-link" routerLink="/login">Login</button>
          <button class="register-btn" routerLink="/register">Register</button>
        </div>
        <!-- Show User info and Logout when logged in -->
        <div *ngIf="isLoggedIn" class="user-info">
          <span class="user-email">{{ userEmail }}</span>
          <button (click)="logout()" class="logout-btn">Logout</button>
        </div>
      </div>
    </nav>
  `,
  styles: [
    `
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      padding: 0 2rem;
      min-height: 64px;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .navbar-left .logo {
      font-weight: bold;
      font-size: 2rem;
      color: #ff9800;
      letter-spacing: 2px;
      margin-right: 2rem;
    }
    .navbar-center {
      display: flex;
      gap: 1rem;
      flex: 1;
      justify-content: center;
    }
    .nav-link {
      background: none;
      border: none;
      color: #333;
      font-size: 1rem;
      font-weight: 500;
      padding: 0.75rem 1.2rem;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
    }
    .nav-link:hover, .nav-link:focus {
      background: #fff3e0;
      color: #ff9800;
      outline: none;
    }
    .navbar-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .auth-buttons {
      display: flex;
      gap: 0.5rem;
    }
    .register-btn {
      background: #ff9800;
      color: #fff;
      border: none;
      padding: 0.75rem 1.2rem;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .register-btn:hover {
      background: #fb8c00;
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .user-email {
      color: #333;
      font-weight: 500;
      font-size: 1rem;
    }
    .logout-btn {
      background: #e53935;
      color: #fff;
      border: none;
      padding: 0.6rem 1.1rem;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }
    .logout-btn:hover {
      background: #b71c1c;
    }
    @media (max-width: 900px) {
      .navbar {
        flex-direction: column;
        align-items: stretch;
        padding: 0 1rem;
      }
      .navbar-center {
        flex-wrap: wrap;
        gap: 0.5rem;
        justify-content: flex-start;
        margin: 0.5rem 0;
      }
      .navbar-right {
        justify-content: flex-end;
      }
    }
    @media (max-width: 600px) {
      .navbar {
        flex-direction: column;
        padding: 0 0.5rem;
      }
      .navbar-center {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
      }
      .navbar-right {
        flex-direction: column;
        align-items: flex-end;
        gap: 0.5rem;
      }
    }
    `
  ]
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

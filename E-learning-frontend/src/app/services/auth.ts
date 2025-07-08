import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
}

interface LoginDto {
  email: string;
  password: string;
}

interface VerifyEmailDto {
  email: string;
  token: string;
}

interface ResendVerificationDto {
  email: string;
}

interface ForgotPasswordDto {
  email: string;
}

interface ResetPasswordDto {
  email: string;
  token: string;
  newPassword: string;
}

interface AuthResponse {
  message: string;
  user?: any;
  token?: string;
  access_token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/auth';
  private loginStatusSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    // Initialize login status
    this.loginStatusSubject.next(this.isLoggedIn());
  }

  // Observable for login status changes
  get loginStatus$(): Observable<boolean> {
    return this.loginStatusSubject.asObservable();
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.status === 409) {
        errorMessage = 'User already exists with this email';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Invalid request data';
      } else if (error.status === 401) {
        errorMessage = 'Invalid credentials';
      } else if (error.status === 404) {
        errorMessage = 'Service not found';
      } else if (error.status === 500) {
        errorMessage = 'Internal server error';
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to server';
      } else {
        errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText}`;
      }
    }
    
    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      originalError: error
    }));
  }

  register(dto: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, dto)
      .pipe(
        catchError(this.handleError)
      );
  }

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, dto)
      .pipe(
        catchError(this.handleError)
      );
  }

  verifyEmail(dto: VerifyEmailDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/verify-email`, dto)
      .pipe(
        catchError(this.handleError)
      );
  }

  resendVerification(dto: ResendVerificationDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/resend-verification`, dto)
      .pipe(
        catchError(this.handleError)
      );
  }

  forgotPassword(dto: ForgotPasswordDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/forgot-password`, dto)
      .pipe(
        catchError(this.handleError)
      );
  }

  resetPassword(dto: ResetPasswordDto): Observable<AuthResponse> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<AuthResponse>(`${this.apiUrl}/reset-password`, dto, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Helper method to check if user is logged in
  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  // Helper method to get current user token
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Helper method to logout
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_data');
    this.loginStatusSubject.next(false);
  }

  // Method to update login status (called after successful login)
  updateLoginStatus(): void {
    this.loginStatusSubject.next(this.isLoggedIn());
  }

  // Method to get current user data
  getCurrentUser(): any {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  // Method to get current user role
  getCurrentUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  // Method to check if user is admin
  isAdmin(): boolean {
    return this.getCurrentUserRole() === 'ADMIN';
  }

  // Method to check if user is instructor
  isInstructor(): boolean {
    return this.getCurrentUserRole() === 'INSTRUCTOR';
  }

  // Method to check if user is student
  isStudent(): boolean {
    return this.getCurrentUserRole() === 'STUDENT';
  }
}

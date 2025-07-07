import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  register(dto: RegisterDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, dto);
  }

  login(dto: LoginDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, dto);
  }

  verifyEmail(dto: VerifyEmailDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-email`, dto);
  }

  resendVerification(dto: ResendVerificationDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/resend-verification`, dto);
  }

  forgotPassword(dto: ForgotPasswordDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, dto);
  }

  resetPassword(dto: ResetPasswordDto): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/reset-password`, dto, { headers });
  }
}

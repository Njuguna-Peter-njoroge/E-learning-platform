import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { AccountStatus, Role } from './interface/interface';

export interface CreateUserDto {
  fullName: string;
  email: string;
  password: string;
  role: Role;
}

export interface UpdateUserDto {
  fullName?: string;
  email?: string;
  role?: Role;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UserFiltersDto {
  status?: AccountStatus;
  role?: Role;
  isVerified?: boolean;
  search?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('accessToken');
    return {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    };
  }

  findAll(filters?: UserFiltersDto): Observable<any[]> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params = params.set(key, value);
        }
      });
    }
    return this.http.get<any[]>(`${this.apiUrl}`, { ...this.getHeaders(), params });
  }

  findByName(fullName: string): Observable<any[]> {
    const params = new HttpParams().set('search', fullName);
    return this.http.get<any[]>(`${this.apiUrl}`, { ...this.getHeaders(), params });
  }

  async getIdByName(fullName: string): Promise<string | null> {
    const users = await firstValueFrom(this.findByName(fullName));
    return users.length > 0 ? users[0].id : null;
  }

  // (other methods unchanged)
}

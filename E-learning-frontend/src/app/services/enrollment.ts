import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateEnrollmentDto {
  courseId: string;
  userId?: string;
}


export interface UpdateEnrollmentDto {
  progress?: number;
}

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  private readonly apiUrl = 'http://localhost:3000/enrollments';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('accessToken');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  create(dto: CreateEnrollmentDto): Observable<any> {
    return this.http.post(`${this.apiUrl}`, dto, this.getAuthHeaders());
  }

  findAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  findOne(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  update(id: string, dto: UpdateEnrollmentDto): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, dto);
  }

  remove(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  enrollByEmail(email: string, courseId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/dev/enroll-by-email`, { email, courseId });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateLessonDto {
  title: string;
  content: string;
  moduleId: string;
  order: number;
}

export interface UpdateLessonDto {
  title?: string;
  content?: string;
  order?: number;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  moduleId: string;
  order: number;
  visibility: string;
}

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private apiUrl = 'http://localhost:3000/lessons'; // Adjust base URL if needed

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  create(dto: CreateLessonDto): Observable<Lesson> {
    return this.http.post<Lesson>(this.apiUrl, dto, { headers: this.getHeaders() });
  }

  findAll(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  findByModule(moduleId: string): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.apiUrl}/module/${moduleId}`, {
      headers: this.getHeaders()
    });
  }

  findOne(id: string): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  update(id: string, dto: UpdateLessonDto): Observable<Lesson> {
    return this.http.patch<Lesson>(`${this.apiUrl}/${id}`, dto, {
      headers: this.getHeaders()
    });
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}

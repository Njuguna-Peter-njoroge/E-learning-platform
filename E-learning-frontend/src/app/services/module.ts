import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateContentDto {
  title: string;
  description?: string;
  courseId: string;
}

export interface UpdateContentDto {
  title?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  private apiUrl = 'http://localhost:3000/modules'; // Update to your API URL

  constructor(private http: HttpClient) {}

  // Create module
  createModule(dto: CreateContentDto): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

  // Get all modules
  getAllModules(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Get modules by course ID
  getModulesByCourse(courseId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/course/${courseId}`);
  }

  // Get single module by ID
  getModuleById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Update a module
  updateModule(id: string, dto: UpdateContentDto): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, dto);
  }

  // Delete a module
  deleteModule(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}


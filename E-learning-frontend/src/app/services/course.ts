import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';

// Enums for course status and difficulty
export enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}


export interface Enrollment {
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  userId: string;
  enrolledAt?: string;
  status?: string;
}

export interface Course {
  id: string;
  iconImage: string;
  title: string;
  description: string;
  level: string;
  category: string;
  status: string;
  instructorId: string;
  instructor?: {
    fullName: string;
  };
  enrollments?: Enrollment[];
  createdAt?: string;
  updatedAt?: string;
}

// DTO used when creating a course
export interface CreateCourseDto {
  iconImage: string;
  title: string;
  description: string;
  level: Difficulty;
  category: string;
  status: CourseStatus;
  instructorName: string; 
}


export interface UpdateCourseDto {
  iconImage?: string;
  title?: string;
  description?: string;
  level?: Difficulty;
  category?: string;
  status?: CourseStatus;
  instructorName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly apiUrl = 'http://localhost:3000/courses'; 

  constructor(private http: HttpClient) {}

  
  create(course: CreateCourseDto): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course);
  }


  findAll(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  
  findOne(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  
  update(id: string, dto: UpdateCourseDto): Observable<Course> {
    const token = localStorage.getItem('access_token'); // Or however you store your token
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.patch<Course>(`${this.apiUrl}/${id}`, dto, { headers });
  }
  


  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // (Optional) Get list of instructor names for dropdowns
  getInstructorNames(): Observable<string[]> {
    return this.http.get<{ fullName: string }[]>(`${this.apiUrl}/instructors`)
      .pipe(map(instructors => instructors.map(i => i.fullName)));
  }

  // Get instructor's courses
  getInstructorCourses(): Observable<Course[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    
    return this.http.get<Course[]>(`${this.apiUrl}/instructor/my-courses`, { headers });
  }

  // Get instructor dashboard stats
  getInstructorDashboardStats(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    
    return this.http.get<any>(`${this.apiUrl}/instructor/dashboard-stats`, { headers });
  }
}

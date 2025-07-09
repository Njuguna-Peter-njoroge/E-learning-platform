import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Student {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isVerified: boolean;
  status: string;
}

export interface CourseProgress {
  course: {
    id: string;
    title: string;
    description: string;
    level: string;
    category: string;
    instructor: {
      fullName: string;
      email: string;
    };
  };
  enrollment: {
    id: string;
    status: string;
    enrolledAt: string;
  };
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
}

export interface StudentTask {
  lesson: {
    id: string;
    title: string;
    content: string;
    order: number;
  };
  module: {
    id: string;
    title: string;
  };
  course: {
    id: string;
    title: string;
    instructor: {
      fullName: string;
    };
  };
  isAvailable: boolean;
  currentProgress: any;
  canStart: boolean;
}

export interface Certificate {
  id: string;
  courseId: string;
  issuedAt: string;
  certificateUrl: string;
  status: string;
  course: {
    title: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Get student profile
  getStudentProfile(): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/users/profile`, {
      headers: this.getHeaders()
    });
  }

  // Get student progress for all enrolled courses
  getStudentProgress(): Observable<CourseProgress[]> {
    return this.http.get<CourseProgress[]>(`${this.apiUrl}/progress/student/progress`, {
      headers: this.getHeaders()
    });
  }

  // Get student tasks/lessons
  getStudentTasks(): Observable<StudentTask[]> {
    return this.http.get<StudentTask[]>(`${this.apiUrl}/progress/student/tasks`, {
      headers: this.getHeaders()
    });
  }

  // Get student certificates
  getStudentCertificates(): Observable<Certificate[]> {
    const userId = localStorage.getItem('user_id');
    return this.http.get<Certificate[]>(`${this.apiUrl}/certificates/user/${userId}`, {
      headers: this.getHeaders()
    });
  }

  // Start a task/lesson
  startTask(lessonId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/progress/student/tasks/${lessonId}/start`, {}, {
      headers: this.getHeaders()
    });
  }

  // Complete a task/lesson
  completeTask(lessonId: string, grade?: number): Observable<any> {
    const body = grade ? { grade } : {};
    return this.http.post(`${this.apiUrl}/progress/student/tasks/${lessonId}/complete`, body, {
      headers: this.getHeaders()
    });
  }

  // Get available courses for enrollment
  getAvailableCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/courses`);
  }

  // Enroll in a course
  enrollInCourse(courseId: string): Observable<any> {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.role !== 'STUDENT') {
        return new Observable(observer => {
          observer.error({ error: { message: 'Only students can enroll in courses.' } });
        });
      }
    } else {
      return new Observable(observer => {
        observer.error({ error: { message: 'User not logged in.' } });
      });
    }
    return this.http.post(`${this.apiUrl}/enrollments`, { courseId }, {
      headers: this.getHeaders()
    });
  }

  // Update student profile
  updateProfile(profileData: Partial<Student>): Observable<Student> {
    return this.http.patch<Student>(`${this.apiUrl}/users/profile`, profileData, {
      headers: this.getHeaders()
    });
  }

  // Get student statistics
  getStudentStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/stats`, {
      headers: this.getHeaders()
    });
  }

  // Admin dashboard: Get all users
  getAllUsers(): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(`${this.apiUrl}/users`, {
      headers: this.getHeaders()
    });
  }

  // Admin dashboard: Get all courses
  getAllCourses(): Observable<{ data: any[] }> {
    return this.http.get<any>(`${this.apiUrl}/courses`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        // Handle both array and object with data property
        if (Array.isArray(response)) {
          return { data: response };
        } else if (response && response.data) {
          return response;
        } else {
          return { data: [] };
        }
      })
    );
  }

  // Admin dashboard: Get all enrollments
  getAllEnrollments(): Observable<any[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    
    return this.http.get<any[]>(`${this.apiUrl}/enrollments`, { headers });
  }

  // Get instructor's students progress
  getInstructorStudentsProgress(): Observable<any[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    
    return this.http.get<any[]>(`${this.apiUrl}/progress/instructor/students-progress`, { headers });
  }

  getInstructorQuizProgress(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/quizzes/course/${courseId}/instructor-progress`);
  }
}

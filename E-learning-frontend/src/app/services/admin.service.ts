import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminStats {
  totalStudents: number;
  totalCourses: number;
  totalInstructors: number;
  totalEnrollments: number;
  pendingApprovals: number;
  activeCourses: number;
  completedCourses: number;
  averageCompletionRate: number;
  monthlyRevenue?: number;
  topCourses?: any[];
  recentActivity?: any[];
}

export interface UserAction {
  userId: string;
  action: 'approve' | 'suspend' | 'delete' | 'activate';
}

export interface CourseAction {
  courseId: string;
  action: 'approve' | 'publish' | 'archive' | 'reject';
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Get admin dashboard statistics
  getDashboardStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/admin/stats`, {
      headers: this.getHeaders()
    });
  }

  // Get all users with pagination and filters
  getAllUsers(page: number = 1, limit: number = 50, role?: string, status?: string): Observable<any> {
    let params = `page=${page}&limit=${limit}`;
    if (role) params += `&role=${role}`;
    if (status) params += `&status=${status}`;
    
    return this.http.get<any>(`${this.apiUrl}/admin/users?${params}`, {
      headers: this.getHeaders()
    });
  }

  // Get all courses with pagination and filters
  getAllCourses(page: number = 1, limit: number = 50, status?: string): Observable<any> {
    let params = `page=${page}&limit=${limit}`;
    if (status) params += `&status=${status}`;
    
    return this.http.get<any>(`${this.apiUrl}/admin/courses?${params}`, {
      headers: this.getHeaders()
    });
  }

  // Get all enrollments with pagination and filters
  getAllEnrollments(page: number = 1, limit: number = 50, status?: string): Observable<any> {
    let params = `page=${page}&limit=${limit}`;
    if (status) params += `&status=${status}`;
    
    return this.http.get<any>(`${this.apiUrl}/admin/enrollments?${params}`, {
      headers: this.getHeaders()
    });
  }

  // User management actions
  approveUser(userId: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/admin/users/${userId}/approve`, {}, {
      headers: this.getHeaders()
    });
  }

  suspendUser(userId: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/admin/users/${userId}/suspend`, {}, {
      headers: this.getHeaders()
    });
  }

  activateUser(userId: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/admin/users/${userId}/activate`, {}, {
      headers: this.getHeaders()
    });
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/admin/users/${userId}`, {
      headers: this.getHeaders()
    });
  }

  // Course management actions
  approveCourse(courseId: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/admin/courses/${courseId}/approve`, {}, {
      headers: this.getHeaders()
    });
  }

  publishCourse(courseId: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/admin/courses/${courseId}/publish`, {}, {
      headers: this.getHeaders()
    });
  }

  archiveCourse(courseId: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/admin/courses/${courseId}/archive`, {}, {
      headers: this.getHeaders()
    });
  }

  rejectCourse(courseId: string, reason?: string): Observable<any> {
    const body = reason ? { reason } : {};
    return this.http.patch<any>(`${this.apiUrl}/admin/courses/${courseId}/reject`, body, {
      headers: this.getHeaders()
    });
  }

  // Analytics endpoints
  getUserGrowth(period: string = '30d'): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/analytics/user-growth?period=${period}`, {
      headers: this.getHeaders()
    });
  }

  getCoursePerformance(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/analytics/course-performance`, {
      headers: this.getHeaders()
    });
  }

  getCompletionRates(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/analytics/completion-rates`, {
      headers: this.getHeaders()
    });
  }

  getRevenueAnalytics(period: string = '30d'): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/analytics/revenue?period=${period}`, {
      headers: this.getHeaders()
    });
  }

  // System health and monitoring
  getSystemHealth(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/system/health`, {
      headers: this.getHeaders()
    });
  }

  getSystemMetrics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/system/metrics`, {
      headers: this.getHeaders()
    });
  }

  // Bulk operations
  bulkApproveUsers(userIds: string[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/users/bulk-approve`, { userIds }, {
      headers: this.getHeaders()
    });
  }

  bulkApproveCourses(courseIds: string[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/courses/bulk-approve`, { courseIds }, {
      headers: this.getHeaders()
    });
  }

  // Export functionality
  exportUsers(format: 'csv' | 'excel' = 'csv'): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/export/users?format=${format}`, {
      headers: this.getHeaders()
    });
  }

  exportCourses(format: 'csv' | 'excel' = 'csv'): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/export/courses?format=${format}`, {
      headers: this.getHeaders()
    });
  }

  exportEnrollments(format: 'csv' | 'excel' = 'csv'): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/export/enrollments?format=${format}`, {
      headers: this.getHeaders()
    });
  }

  // Notification management
  sendNotificationToUsers(userIds: string[], message: string, type: 'info' | 'warning' | 'success' | 'error' = 'info'): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/notifications/send`, {
      userIds,
      message,
      type
    }, {
      headers: this.getHeaders()
    });
  }

  // Settings management
  updatePlatformSettings(settings: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/admin/settings`, settings, {
      headers: this.getHeaders()
    });
  }

  getPlatformSettings(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/settings`, {
      headers: this.getHeaders()
    });
  }
} 
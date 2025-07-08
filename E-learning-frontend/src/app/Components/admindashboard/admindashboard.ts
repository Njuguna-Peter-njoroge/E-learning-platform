import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { CourseService } from '../../services/course';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalInstructors: number;
  totalEnrollments: number;
  pendingApprovals: number;
  activeCourses: number;
  completedCourses: number;
  averageCompletionRate: number;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  isVerified: boolean;
  createdAt: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  status: string;
  instructor?: {
    fullName: string;
  };
  enrollmentCount?: number;
}

interface Enrollment {
  id: string;
  student: {
    fullName: string;
    email: string;
  };
  course: {
    title: string;
  };
  status: string;
  enrolledAt: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admindashboard.html',
  styleUrls: ['./admindashboard.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalStudents: 0,
    totalCourses: 0,
    totalInstructors: 0,
    totalEnrollments: 0,
    pendingApprovals: 0,
    activeCourses: 0,
    completedCourses: 0,
    averageCompletionRate: 0
  };

  users: User[] = [];
  courses: Course[] = [];
  enrollments: Enrollment[] = [];
  
  // UI State
  showStudents = false;
  showInstructors = false;
  showCourses = false;
  showEnrollments = false;
  activeTab = 'overview';
  
  // Loading states
  loading = true;
  loadingUsers = false;
  loadingCourses = false;
  loadingEnrollments = false;

  // Filter states
  userFilter = '';
  courseFilter = '';
  enrollmentFilter = '';

  // Computed properties for template
  get studentCount(): number {
    return this.users.filter(u => u.role === 'STUDENT').length;
  }

  get instructorCount(): number {
    return this.users.filter(u => u.role === 'INSTRUCTOR').length;
  }

  get courseCount(): number {
    return this.courses.length;
  }

  get enrollmentCount(): number {
    return this.enrollments.length;
  }

  constructor(
    private studentService: StudentService,
    private courseService: CourseService,
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    
    // Load all data in parallel
    Promise.all([
      this.loadUsers(),
      this.loadCourses(),
      this.loadEnrollments()
    ]).finally(() => {
      this.loading = false;
      this.calculateStats();
    });
  }

  loadUsers() {
    this.loadingUsers = true;
    return new Promise<void>((resolve) => {
      this.studentService.getAllUsers().subscribe({
        next: (response) => {
          this.users = response.data || [];
          resolve();
        },
        error: (error) => {
          console.error('Error loading users:', error);
          resolve();
        },
        complete: () => {
          this.loadingUsers = false;
        }
      });
    });
  }

  loadCourses() {
    this.loadingCourses = true;
    return new Promise<void>((resolve) => {
      this.studentService.getAllCourses().subscribe({
        next: (response) => {
          this.courses = response.data || [];
          resolve();
        },
        error: (error) => {
          console.error('Error loading courses:', error);
          resolve();
        },
        complete: () => {
          this.loadingCourses = false;
        }
      });
    });
  }

  loadEnrollments() {
    this.loadingEnrollments = true;
    return new Promise<void>((resolve) => {
      this.studentService.getAllEnrollments().subscribe({
        next: (response) => {
          console.log('Raw enrollment response:', response);
          // Transform the backend data structure to match frontend interface
          this.enrollments = (response || []).map((enrollment: any) => ({
            id: enrollment.id,
            student: {
              fullName: enrollment.user?.fullName || 'Unknown',
              email: enrollment.user?.email || 'Unknown'
            },
            course: {
              title: enrollment.course?.title || 'Unknown'
            },
            status: enrollment.status || 'ENROLLED',
            enrolledAt: enrollment.enrolledAt || enrollment.createdAt || new Date().toISOString()
          }));
          console.log('Transformed enrollments:', this.enrollments);
          resolve();
        },
        error: (error) => {
          console.error('Error loading enrollments:', error);
          resolve();
        },
        complete: () => {
          this.loadingEnrollments = false;
        }
      });
    });
  }

  calculateStats() {
    // User stats
    this.stats.totalStudents = this.users.filter(u => u.role === 'STUDENT').length;
    this.stats.totalInstructors = this.users.filter(u => u.role === 'INSTRUCTOR').length;
    this.stats.pendingApprovals = this.users.filter(u => u.status === 'PENDING').length;

    // Course stats
    this.stats.totalCourses = this.courses.length;
    this.stats.activeCourses = this.courses.filter(c => c.status === 'PUBLISHED').length;
    this.stats.completedCourses = this.courses.filter(c => c.status === 'ARCHIVED').length;

    // Enrollment stats
    this.stats.totalEnrollments = this.enrollments.length;
    console.log('Enrollment stats calculated:', this.stats.totalEnrollments, 'enrollments');
    
    // Calculate completion rate
    const completedEnrollments = this.enrollments.filter(e => e.status === 'COMPLETED').length;
    this.stats.averageCompletionRate = this.stats.totalEnrollments > 0 
      ? Math.round((completedEnrollments / this.stats.totalEnrollments) * 100) 
      : 0;
  }

  // Filter methods
  getFilteredUsers(): User[] {
    if (!this.userFilter) return this.users;
    return this.users.filter(user => 
      user.fullName.toLowerCase().includes(this.userFilter.toLowerCase()) ||
      user.email.toLowerCase().includes(this.userFilter.toLowerCase()) ||
      user.role.toLowerCase().includes(this.userFilter.toLowerCase())
    );
  }

  getFilteredCourses(): Course[] {
    if (!this.courseFilter) return this.courses;
    return this.courses.filter(course => 
      course.title.toLowerCase().includes(this.courseFilter.toLowerCase()) ||
      course.category.toLowerCase().includes(this.courseFilter.toLowerCase()) ||
      course.level.toLowerCase().includes(this.courseFilter.toLowerCase())
    );
  }

  getFilteredEnrollments(): Enrollment[] {
    if (!this.enrollmentFilter) return this.enrollments;
    return this.enrollments.filter(enrollment => 
      enrollment.student.fullName.toLowerCase().includes(this.enrollmentFilter.toLowerCase()) ||
      enrollment.course.title.toLowerCase().includes(this.enrollmentFilter.toLowerCase()) ||
      enrollment.status.toLowerCase().includes(this.enrollmentFilter.toLowerCase())
    );
  }

  // Action methods
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  toggleStudents() {
    this.showStudents = !this.showStudents;
    if (this.showStudents) {
      this.showInstructors = false;
      this.showCourses = false;
      this.showEnrollments = false;
    }
  }

  toggleInstructors() {
    this.showInstructors = !this.showInstructors;
    if (this.showInstructors) {
      this.showStudents = false;
      this.showCourses = false;
      this.showEnrollments = false;
    }
  }

  toggleCourses() {
    this.showCourses = !this.showCourses;
    if (this.showCourses) {
      this.showStudents = false;
      this.showInstructors = false;
      this.showEnrollments = false;
    }
  }

  toggleEnrollments() {
    this.showEnrollments = !this.showEnrollments;
    if (this.showEnrollments) {
      this.showStudents = false;
      this.showInstructors = false;
      this.showCourses = false;
    }
  }

  // Admin actions
  addNewCourse() {
    this.router.navigate(['/courses']);
  }

  manageUsers() {
    this.setActiveTab('users');
  }

  manageCourses() {
    this.setActiveTab('courses');
  }

  viewAnalytics() {
    this.setActiveTab('analytics');
  }

  // User management actions
  approveUser(userId: string) {
    this.adminService.approveUser(userId).subscribe({
      next: (response) => {
        console.log('User approved successfully:', response);
        this.refreshData();
      },
      error: (error) => {
        console.error('Error approving user:', error);
        // TODO: Show error notification
      }
    });
  }

  suspendUser(userId: string) {
    this.adminService.suspendUser(userId).subscribe({
      next: (response) => {
        console.log('User suspended successfully:', response);
        this.refreshData();
      },
      error: (error) => {
        console.error('Error suspending user:', error);
        // TODO: Show error notification
      }
    });
  }

  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      this.adminService.deleteUser(userId).subscribe({
        next: (response) => {
          console.log('User deleted successfully:', response);
          this.refreshData();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          // TODO: Show error notification
        }
      });
    }
  }

  // Course management actions
  approveCourse(courseId: string) {
    this.adminService.approveCourse(courseId).subscribe({
      next: (response) => {
        console.log('Course approved successfully:', response);
        this.refreshData();
      },
      error: (error) => {
        console.error('Error approving course:', error);
        // TODO: Show error notification
      }
    });
  }

  publishCourse(courseId: string) {
    this.adminService.publishCourse(courseId).subscribe({
      next: (response) => {
        console.log('Course published successfully:', response);
        this.refreshData();
      },
      error: (error) => {
        console.error('Error publishing course:', error);
        // TODO: Show error notification
      }
    });
  }

  archiveCourse(courseId: string) {
    this.adminService.archiveCourse(courseId).subscribe({
      next: (response) => {
        console.log('Course archived successfully:', response);
        this.refreshData();
      },
      error: (error) => {
        console.error('Error archiving course:', error);
        // TODO: Show error notification
      }
    });
  }

  // Utility methods
  getStatusColor(status: string): string {
    switch (status.toUpperCase()) {
      case 'ACTIVE': return 'green';
      case 'PENDING': return 'orange';
      case 'SUSPENDED': return 'red';
      case 'COMPLETED': return 'blue';
      case 'PUBLISHED': return 'green';
      case 'DRAFT': return 'gray';
      case 'ARCHIVED': return 'purple';
      default: return 'gray';
    }
  }

  getRoleColor(role: string): string {
    switch (role.toUpperCase()) {
      case 'ADMIN': return 'red';
      case 'INSTRUCTOR': return 'blue';
      case 'STUDENT': return 'green';
      default: return 'gray';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  refreshData() {
    this.loadDashboardData();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}

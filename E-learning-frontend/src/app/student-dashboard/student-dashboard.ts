import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StudentService, Student, CourseProgress, StudentTask, Certificate } from '../services/student.service';
import {Header} from '../component/header/header';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.html',
  styleUrls: ['./student-dashboard.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, Header]
})
export class StudentDashboardComponent implements OnInit {
  // Student data
  student = signal<Student | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  // Dashboard data
  courseProgress = signal<CourseProgress[]>([]);
  studentTasks = signal<StudentTask[]>([]);
  certificates = signal<Certificate[]>([]);
  availableCourses = signal<any[]>([]);
  financeData = signal<{ totalPayable: number; totalPaid: number; others: number } | null>(null);

  // UI state
  activeTab = signal('overview');
  isEditingProfile = signal(false);
  selectedTask: StudentTask | null = null;

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading.set(true);
    this.error.set(null);

    // Load student profile
    this.studentService.getStudentProfile().subscribe({
      next: (student) => {
        this.student.set(student);
      },
      error: (err) => {
        console.error('Error loading student profile:', err);
        this.error.set('Failed to load student profile');
      }
    });

    // Load course progress
    this.studentService.getStudentProgress().subscribe({
      next: (progress) => {
        this.courseProgress.set(progress);
      },
      error: (err) => {
        console.error('Error loading course progress:', err);
        this.error.set('Failed to load course progress');
      }
    });

    // Load student tasks
    this.studentService.getStudentTasks().subscribe({
      next: (tasks) => {
        this.studentTasks.set(tasks);
      },
      error: (err) => {
        console.error('Error loading student tasks:', err);
        this.error.set('Failed to load student tasks');
      }
    });

    // Load certificates
    this.studentService.getStudentCertificates().subscribe({
      next: (certs) => {
        this.certificates.set(certs);
      },
      error: (err) => {
        console.error('Error loading certificates:', err);
        this.error.set('Failed to load certificates');
      }
    });

    // Load available courses
    this.studentService.getAvailableCourses().subscribe({
      next: (courses) => {
        this.availableCourses.set(courses);
      },
      error: (err) => {
        console.error('Error loading available courses:', err);
        this.error.set('Failed to load available courses');
      }
    });

    // Mock finance data for now (replace with real API if available)
    this.financeData.set({ totalPayable: 10000, totalPaid: 5000, others: 300 });

    this.isLoading.set(false);
  }

  // Tab navigation
  setActiveTab(tab: string) {
    this.activeTab.set(tab);
  }

  // Task management
  startTask(task: StudentTask) {
    if (!task.canStart) return;

    this.studentService.startTask(task.lesson.id).subscribe({
      next: (result) => {
        console.log('Task started:', result);
        this.loadDashboardData(); // Refresh data
      },
      error: (err) => {
        console.error('Error starting task:', err);
        this.error.set('Failed to start task');
      }
    });
  }

  completeTask(task: StudentTask) {
    this.studentService.completeTask(task.lesson.id).subscribe({
      next: (result) => {
        console.log('Task completed:', result);
        this.loadDashboardData(); // Refresh data
      },
      error: (err) => {
        console.error('Error completing task:', err);
        this.error.set('Failed to complete task');
      }
    });
  }

  // Course enrollment
  enrollInCourse(courseId: string) {
    this.studentService.enrollInCourse(courseId).subscribe({
      next: (result) => {
        console.log('Enrolled in course:', result);
        this.loadDashboardData(); // Refresh data
      },
      error: (err) => {
        console.error('Error enrolling in course:', err);
        this.error.set('Failed to enroll in course');
      }
    });
  }

  // Profile management
  toggleEditProfile() {
    this.isEditingProfile.set(!this.isEditingProfile());
  }

  updateProfile() {
    if (!this.student()) return;

    const profileData = {
      fullName: this.student()?.fullName,
      email: this.student()?.email
    };

    this.studentService.updateProfile(profileData).subscribe({
      next: (updatedStudent) => {
        this.student.set(updatedStudent);
        this.isEditingProfile.set(false);
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.error.set('Failed to update profile');
      }
    });
  }

  // Utility methods
  getProgressColor(percentage: number): string {
    if (percentage >= 80) return '#4CAF50';
    if (percentage >= 60) return '#FF9800';
    return '#F44336';
  }

  getCourseCount(): number {
    return this.courseProgress().length;
  }

  getCompletedCourses(): number {
    return this.courseProgress().filter(course => course.progressPercentage === 100).length;
  }

  getTotalCertificates(): number {
    return this.certificates().length;
  }

  getAvailableTasks(): number {
    return this.studentTasks().filter(task => task.canStart).length;
  }

  // Date formatting
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

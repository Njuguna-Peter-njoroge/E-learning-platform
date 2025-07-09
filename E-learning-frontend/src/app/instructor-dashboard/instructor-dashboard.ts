import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { StudentService } from '../services/student.service';
import { CourseService } from '../services/course';
import { AuthService } from '../services/auth';
import { Header } from '../component/header/header';

interface InstructorStats {
  totalCourses: number;
  totalStudents: number;
  totalLessons: number;
  averageCompletionRate: number;
  activeCourses: number;
  pendingApprovals: number;
}

interface InstructorCourse {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  status: string;
  enrollmentCount: number;
  averageProgress: number;
  totalLessons?: number;
  createdAt: string;
  enrollments?: {
    user: {
      id: string;
      fullName: string;
      email: string;
    };
    userId: string;
    enrolledAt?: string;
    status?: string;
  }[];
}

interface StudentProgress {
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
  lastActivity: string;
  enrollmentDate?: string;
  quizScore?: number; // Optional quiz score for progress table
}

@Component({
  selector: 'app-instructor-dashboard',
  templateUrl: './instructor-dashboard.html',
  styleUrls: ['./instructor-dashboard.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, Header]
})
export class InstructorDashboardComponent implements OnInit {
  // Instructor data
  instructor = signal<any>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  // Dashboard data
  stats = signal<InstructorStats>({
    totalCourses: 0,
    totalStudents: 0,
    totalLessons: 0,
    averageCompletionRate: 0,
    activeCourses: 0,
    pendingApprovals: 0
  });

  courses = signal<InstructorCourse[]>([]);
  studentProgress = signal<StudentProgress[]>([]);

  // UI state
  activeTab = signal('overview');
  courseFilter = '';
  studentFilter = '';
  quizFilter = '';
  quizProgress = signal<any[]>([]);

  // Math object for template access
  Math = Math;

  constructor(
    private studentService: StudentService,
    private courseService: CourseService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadInstructorData();
  }

  loadInstructorData() {
    this.isLoading.set(true);
    this.error.set(null);

    // Load instructor profile - using stored user data for now
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      console.log('👨‍🏫 Instructor data:', user);
      this.instructor.set(user);
    } else {
      console.log('❌ No user data found in localStorage');
    }

    // Load instructor courses
    this.loadInstructorCourses();

    // Load student progress for instructor's courses
    this.loadStudentProgress();

    // Load quiz progress
    this.loadQuizProgress();

    this.isLoading.set(false);
  }

  loadInstructorCourses() {
    // Use the new instructor-specific endpoint
    this.courseService.getInstructorCourses().subscribe({
      next: (response: any) => {
        const courses = response || [];
        this.courses.set(courses);
        this.calculateStats();
      },
      error: (err: any) => {
        console.error('Error loading instructor courses:', err);
        this.error.set('Failed to load courses');
      }
    });
  }

  loadStudentProgress() {
    // Use the new instructor students progress endpoint
    this.studentService.getInstructorStudentsProgress().subscribe({
      next: (response: any) => {
        console.log('📊 Student progress response:', response);
        const progress = response || [];
        this.studentProgress.set(progress);
        console.log('📊 Set student progress:', progress);
      },
      error: (err: any) => {
        console.error('❌ Error loading student progress:', err);
        // Fallback to empty array if endpoint fails
        this.studentProgress.set([]);
      }
    });
  }

  loadQuizProgress() {
    // Load quiz progress for all instructor's courses
    const courses = this.courses();
    const quizProgressPromises = courses.map(course => 
      this.studentService.getInstructorQuizProgress(course.id).toPromise()
    );

    Promise.all(quizProgressPromises).then(results => {
      const allQuizProgress = results.flat().filter(Boolean);
      this.quizProgress.set(allQuizProgress);
      console.log('📊 Quiz progress loaded:', allQuizProgress);
    }).catch(err => {
      console.error('❌ Error loading quiz progress:', err);
      this.quizProgress.set([]);
    });
  }

  calculateStats() {
    const courses = this.courses();
    const progress = this.studentProgress();

    this.stats.set({
      totalCourses: courses.length,
      totalStudents: progress.length,
      totalLessons: courses.reduce((sum, course) => sum + (course.totalLessons || 0), 0),
      averageCompletionRate: progress.length > 0 
        ? Math.round(progress.reduce((sum, p) => sum + p.progressPercentage, 0) / progress.length)
        : 0,
      activeCourses: courses.filter(c => c.status === 'PUBLISHED').length,
      pendingApprovals: courses.filter(c => c.status === 'DRAFT').length
    });
  }

  // Tab navigation
  setActiveTab(tab: string) {
    this.activeTab.set(tab);
  }

  // Course management
  createCourse() {
    this.router.navigate(['/courses/create']);
  }

  editCourse(courseId: string) {
    this.router.navigate(['/courses', courseId, 'edit']);
  }

  viewCourseDetails(courseId: string) {
    this.router.navigate(['/courses', courseId]);
  }

  publishCourse(courseId: string) {
    // This would need backend implementation
    console.log('Publishing course:', courseId);
  }

  archiveCourse(courseId: string) {
    // This would need backend implementation
    console.log('Archiving course:', courseId);
  }

  addQuiz() {
    this.router.navigate(['/courses']);
  }

  // Student management
  viewStudentProgress(studentId: string) {
    console.log('Viewing progress for student:', studentId);
    // This would navigate to a detailed student progress page
    this.router.navigate(['/instructor/student', studentId, 'progress']);
  }

  sendMessageToStudent(studentId: string) {
    console.log('Sending message to student:', studentId);
    // This would open a messaging interface
    // For now, we'll show an alert
    alert('Messaging feature will be implemented soon!');
  }

  viewStudentDetails(studentId: string) {
    console.log('Viewing details for student:', studentId);
    // This would navigate to student profile page
    this.router.navigate(['/instructor/student', studentId]);
  }

  exportStudentReport(studentId: string) {
    console.log('Exporting report for student:', studentId);
    // This would generate and download a PDF report
    alert('Report export feature will be implemented soon!');
  }

  // Filter methods
  getFilteredCourses(): InstructorCourse[] {
    const courses = this.courses();
    if (!this.courseFilter) return courses;
    
    return courses.filter(course => 
      course.title.toLowerCase().includes(this.courseFilter.toLowerCase()) ||
      course.category.toLowerCase().includes(this.courseFilter.toLowerCase()) ||
      course.level.toLowerCase().includes(this.courseFilter.toLowerCase())
    );
  }

  getFilteredStudents(): StudentProgress[] {
    const students = this.studentProgress();
    if (!this.studentFilter && !this.courseFilter) return students;
    
    return students.filter(student => {
      const matchesSearch = !this.studentFilter || 
        student.studentName.toLowerCase().includes(this.studentFilter.toLowerCase()) ||
        student.studentEmail.toLowerCase().includes(this.studentFilter.toLowerCase()) ||
        student.courseTitle.toLowerCase().includes(this.studentFilter.toLowerCase());
      
      const matchesCourse = !this.courseFilter || 
        student.courseTitle === this.courseFilter;
      
      return matchesSearch && matchesCourse;
    });
  }

  // Student statistics methods
  getAverageProgress(): number {
    const students = this.getFilteredStudents();
    if (students.length === 0) return 0;
    
    const totalProgress = students.reduce((sum, student) => sum + student.progressPercentage, 0);
    return Math.round(totalProgress / students.length);
  }

  getCompletedStudents(): number {
    return this.getFilteredStudents().filter(student => student.progressPercentage === 100).length;
  }

  getActiveStudents(): number {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return this.getFilteredStudents().filter(student => {
      const lastActivity = new Date(student.lastActivity);
      return lastActivity > thirtyDaysAgo;
    }).length;
  }

  // Progress status methods
  getProgressStatusClass(percentage: number): string {
    if (percentage >= 80) return 'status-excellent';
    if (percentage >= 60) return 'status-good';
    if (percentage >= 40) return 'status-average';
    return 'status-needs-improvement';
  }

  getProgressStatusText(percentage: number): string {
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good';
    if (percentage >= 40) return 'Average';
    return 'Needs Improvement';
  }

  getCourseStatusClass(percentage: number): string {
    if (percentage === 100) return 'status-completed';
    if (percentage >= 80) return 'status-near-completion';
    if (percentage >= 50) return 'status-in-progress';
    return 'status-just-started';
  }

  getCourseStatusText(percentage: number): string {
    if (percentage === 100) return 'Completed';
    if (percentage >= 80) return 'Near Completion';
    if (percentage >= 50) return 'In Progress';
    return 'Just Started';
  }

  // Utility methods
  getProgressColor(percentage: number): string {
    if (percentage >= 80) return '#4CAF50';
    if (percentage >= 60) return '#FF9800';
    if (percentage >= 40) return '#FFC107';
    return '#F44336';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PUBLISHED': return 'status-active';
      case 'DRAFT': return 'status-pending';
      case 'ARCHIVED': return 'status-suspended';
      default: return 'status-pending';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'PUBLISHED': return 'Active';
      case 'DRAFT': return 'Draft';
      case 'ARCHIVED': return 'Archived';
      default: return 'Unknown';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Quiz progress methods
  getQuizCount(courseId: string): number {
    // This would need to be implemented based on your quiz data structure
    return 0; // Placeholder
  }

  getStudentQuizProgress(courseId: string): any[] {
    return this.quizProgress().filter(p => p.courseId === courseId);
  }

  getQuizProgressForStudent(studentId: string): any[] {
    return this.quizProgress().filter(p => p.student?.id === studentId);
  }

  getAverageQuizScore(courseId: string): number {
    const courseQuizProgress = this.getStudentQuizProgress(courseId);
    if (courseQuizProgress.length === 0) return 0;
    
    const totalScore = courseQuizProgress.reduce((sum, p) => sum + (p.averageScore || 0), 0);
    return Math.round(totalScore / courseQuizProgress.length);
  }

  getQuizProgressStatus(score: number): string {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  }

  getQuizProgressColor(score: number): string {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  }

  sendReminder(studentId: string, courseId: string) {
    console.log('Sending reminder to student:', studentId, 'for course:', courseId);
    // This would typically send an email or notification
  }
} 
import { Component, OnInit } from '@angular/core';
import { Header } from "../../component/header/header";
import { ReviewComponentComponent } from "../review-component/review-component";
import { ModuleComponent } from "../module/module";
import { ActivatedRoute, Router } from '@angular/router';
import { LessonCreateComponent } from '../lesson-create/lesson-create';
import { QuizCreateComponent } from '../quiz-create/quiz-create';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModuleService } from '../../services/module';
import { EnrollmentService } from '../../services/enrollment';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-course-details',
  imports: [CommonModule, RouterModule, Header, ReviewComponentComponent, ModuleComponent, LessonCreateComponent, QuizCreateComponent],
  template: `
    <app-header/>

    <!-- Quiz Access Banner for Students -->
    <div *ngIf="!isInstructorOrAdmin" class="bg-gradient-to-r from-orange-500 to-red-600 text-white py-6">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h2 class="text-2xl font-bold mb-2">Ready to Test Your Knowledge?</h2>
            <p class="text-orange-100 mb-4">Access quizzes to track your learning progress and earn certificates.</p>
            <div class="flex items-center gap-4">
              <a
                [routerLink]="['/courses', courseId, 'quizzes']"
                class="px-6 py-3 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-colors duration-200 font-medium flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Take Course Quizzes
              </a>
              <button
                *ngIf="!isEnrolled"
                class="px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-orange-600 transition-colors duration-200"
                (click)="enrollInCourse()"
                [disabled]="isEnrolling"
              >
                {{ isEnrolling ? 'Enrolling...' : 'Enroll in Course' }}
              </button>
            </div>
          </div>
          <div class="hidden md:block">
            <svg class="w-24 h-24 text-white opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="relative h-[600px]">
      <div
        class="absolute inset-0 bg-center bg-cover brightness-50 z-0 h-[600px]"
        style="background-image: url('assets/images/maroon students.jpg')"
      ></div>
    </div>

    <div class="grid grid-cols-[700px,500px] gap-20 px-20 ">
      <div>
        <app-review-component/>

        <!-- Quiz Section for Students -->
        <div *ngIf="!isInstructorOrAdmin" class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Course Quizzes
          </h3>
          <p class="text-gray-600 mb-4">Test your knowledge and track your progress with interactive quizzes.</p>
          <div class="flex gap-3">
            <a
              [routerLink]="['/courses', courseId, 'quizzes']"
              class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
              Start Quizzes
            </a>
            <span *ngIf="!isEnrolled" class="text-sm text-gray-500 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Enrollment required
            </span>
          </div>
        </div>

        <ng-container *ngIf="isInstructorOrAdmin">
          <button class="action-btn success mb-4" (click)="goToQuizCreate()">📝 Add Quiz</button>
        </ng-container>

        <div *ngFor="let module of modules">
          <h4 class="font-bold mt-4 mb-2">Module: {{ module.title }}</h4>
          <ul *ngIf="module.lessons && module.lessons.length > 0">
            <li *ngFor="let lesson of module.lessons">
              {{ lesson.title }}
            </li>
          </ul>
          <div *ngIf="!module.lessons || module.lessons.length === 0" class="text-gray-500 italic">
            No lessons in this module.
          </div>
        </div>
      </div>

      <div>
        <!-- Show Add Lesson/Quiz for instructor or admin -->
        <ng-container *ngIf="isInstructorOrAdmin">
          <div *ngFor="let module of modules">
            <h4 class="font-bold mt-4 mb-2">Module: {{ module.title }}</h4>
            <app-lesson-create [moduleId]="module.id" (lessonCreated)="onLessonOrQuizCreated()" />
          </div>
          <app-quiz-create [courseId]="courseId" (quizCreated)="onLessonOrQuizCreated()" />
        </ng-container>
        <app-module-component />
      </div>
    </div>
  `,
  styles: ``
})
export class CourseDetails implements OnInit {
  courseId: string = '';
  isInstructorOrAdmin = false;
  isEnrolled = false;
  isEnrolling = false;
  modules: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private moduleService: ModuleService,
    private router: Router,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    // Check user role from localStorage
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      this.isInstructorOrAdmin = user.role === 'INSTRUCTOR' || user.role === 'ADMIN';

      // Check enrollment status for students
      if (!this.isInstructorOrAdmin) {
        this.checkEnrollmentStatus();
      }
    }

    this.moduleService.getModulesByCourse(this.courseId).subscribe({
      next: (data: any[]) => this.modules = data,
      error: (err: any) => this.modules = []
    });
    console.log('Course ID from route:', this.courseId);
  }

  checkEnrollmentStatus() {
    // This would typically check enrollment status from backend
    // For now, we'll assume not enrolled to show enrollment option
    this.isEnrolled = false;
  }

  enrollInCourse() {
    this.isEnrolling = true;

    this.studentService.enrollInCourse(this.courseId).subscribe({
      next: () => {
        this.isEnrolled = true;
        this.isEnrolling = false;
        // Show success message or redirect
      },
      error: (err) => {
        this.isEnrolling = false;
        console.error('Enrollment failed:', err);
        // Show error message
      }
    });
  }

  onLessonOrQuizCreated() {
  }

  goToQuizCreate() {
    this.router.navigate([`/courses/${this.courseId}/quizzes/create`]);
  }
}

import { Component, OnInit } from '@angular/core';
import { Header } from "../../component/header/header";
import { ReviewComponentComponent } from "../review-component/review-component";
import { ModuleComponent } from "../module/module";
import { ActivatedRoute } from '@angular/router';
import { LessonCreateComponent } from '../lesson-create/lesson-create';
import { QuizCreateComponent } from '../quiz-create/quiz-create';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-course-details',
  imports: [CommonModule, RouterModule, Header, ReviewComponentComponent, ModuleComponent, LessonCreateComponent, QuizCreateComponent],
  template: `
    <app-header/>
    <div class="relative h-[600px]">
      <div
        class="absolute inset-0 bg-center bg-cover brightness-50 z-0 h-[600px]"
        style="background-image: url('assets/images/maroon students.jpg')"
      ></div>
    </div>  
    <div class="grid grid-cols-[700px,500px] gap-20 px-20 ">
      <div>
        <app-review-component/>
      </div>
      <div>
        <!-- Show Add Lesson/Quiz for instructor or admin -->
        <ng-container *ngIf="isInstructorOrAdmin">
          <app-lesson-create [courseId]="courseId" (lessonCreated)="onLessonOrQuizCreated()" />
          <app-quiz-create [courseId]="courseId" (quizCreated)="onLessonOrQuizCreated()" />
        </ng-container>
        <ng-container *ngIf="!isInstructorOrAdmin">
          <a [routerLink]="['/courses', courseId, 'quizzes']" class="bg-orange-600 text-white px-4 py-2 rounded block text-center mt-4">Take Quizzes for this Course</a>
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

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    // Check user role from localStorage
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      this.isInstructorOrAdmin = user.role === 'INSTRUCTOR' || user.role === 'ADMIN';
    }
    console.log('Course ID from route:', this.courseId);
  }

  onLessonOrQuizCreated() {
    // Optionally refresh lessons/quizzes list here
    // (implementation depends on how lessons/quizzes are loaded)
  }
}

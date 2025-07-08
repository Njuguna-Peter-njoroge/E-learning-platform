import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseService, CreateCourseDto, CourseStatus, Difficulty } from '../../services/course';

@Component({
  selector: 'app-course-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isAdmin; else notAllowed" class="max-w-xl mx-auto p-8 bg-white rounded shadow mt-10">
      <h2 class="text-2xl font-bold mb-6">Create New Course</h2>
      <form (ngSubmit)="createCourse()" #courseForm="ngForm">
        <div class="mb-4">
          <label class="block font-semibold mb-1">Title</label>
          <input type="text" class="border rounded w-full p-2" [(ngModel)]="course.title" name="title" required />
        </div>
        <div class="mb-4">
          <label class="block font-semibold mb-1">Description</label>
          <textarea class="border rounded w-full p-2" [(ngModel)]="course.description" name="description" required></textarea>
        </div>
        <div class="mb-4">
          <label class="block font-semibold mb-1">Level</label>
          <select class="border rounded w-full p-2" [(ngModel)]="course.level" name="level" required>
            <option [ngValue]="'BEGINNER'">Beginner</option>
            <option [ngValue]="'INTERMEDIATE'">Intermediate</option>
            <option [ngValue]="'ADVANCED'">Advanced</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block font-semibold mb-1">Category</label>
          <input type="text" class="border rounded w-full p-2" [(ngModel)]="course.category" name="category" required />
        </div>
        <div class="mb-4">
          <label class="block font-semibold mb-1">Icon Image URL</label>
          <input type="text" class="border rounded w-full p-2" [(ngModel)]="course.iconImage" name="iconImage" />
        </div>
        <div class="mb-4">
          <label class="block font-semibold mb-1">Status</label>
          <select class="border rounded w-full p-2" [(ngModel)]="course.status" name="status" required>
            <option [ngValue]="'DRAFT'">Draft</option>
            <option [ngValue]="'PUBLISHED'">Published</option>
          </select>
        </div>
        <button type="submit" class="bg-orange-600 text-white px-4 py-2 rounded" [disabled]="isLoading">Create Course</button>
        <div *ngIf="error" class="text-red-600 mt-2">{{ error }}</div>
      </form>
    </div>
    <ng-template #notAllowed>
      <div class="max-w-xl mx-auto p-8 bg-white rounded shadow mt-10 text-center">
        <h2 class="text-xl font-bold text-red-600">Access Denied</h2>
        <p>You must be an admin to create a course.</p>
      </div>
    </ng-template>
  `
})
export class CourseCreateComponent {
  course: Partial<CreateCourseDto> = {
    title: '',
    description: '',
    level: Difficulty.BEGINNER,
    category: '',
    iconImage: '',
    status: CourseStatus.DRAFT,
    instructorName: ''
  };
  isLoading = false;
  error: string | null = null;
  isAdmin = false;

  constructor(private courseService: CourseService, private router: Router) {
    // Set instructorName from localStorage user_data
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      this.course.instructorName = user.id;
      this.isAdmin = user.role === 'ADMIN';
    }
  }

  createCourse() {
    if (!this.isAdmin) return;
    this.isLoading = true;
    this.error = null;
    this.courseService.create(this.course as CreateCourseDto).subscribe({
      next: (created) => {
        this.isLoading = false;
        this.router.navigate(['/courses', created.id]);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err?.error?.message || 'Failed to create course.';
      }
    });
  }
} 
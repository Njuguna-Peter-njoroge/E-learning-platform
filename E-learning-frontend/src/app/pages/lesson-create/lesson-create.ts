import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LessonService, CreateLessonDto } from '../../services/lesson';

@Component({
  selector: 'app-lesson-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-gray-100 p-4 rounded mb-4">
      <h3 class="font-bold mb-2">Add Lesson</h3>
      <form (ngSubmit)="addLesson()">
        <div class="mb-2">
          <input type="text" class="border rounded w-full p-2" [(ngModel)]="lesson.title" name="title" placeholder="Lesson Title" required />
        </div>
        <div class="mb-2">
          <textarea class="border rounded w-full p-2" [(ngModel)]="lesson.content" name="content" placeholder="Lesson Content" required></textarea>
        </div>
        <div class="mb-2">
          <input type="number" class="border rounded w-full p-2" [(ngModel)]="lesson.order" name="order" placeholder="Order (e.g. 1)" min="1" required />
        </div>
        <button type="submit" class="bg-orange-600 text-white px-3 py-1 rounded" [disabled]="isLoading">Add Lesson</button>
        <span *ngIf="error" class="text-red-600 ml-2">{{ error }}</span>
      </form>
    </div>
  `
})
export class LessonCreateComponent {
  @Input() courseId!: string;
  @Output() lessonCreated = new EventEmitter<void>();
  lesson: Partial<CreateLessonDto> = { title: '', content: '', order: 1 };
  isLoading = false;
  error: string | null = null;

  constructor(private lessonService: LessonService) {}

  addLesson() {
    if (!this.courseId) return;
    this.isLoading = true;
    this.error = null;
    this.lessonService.create({ ...this.lesson, courseId: this.courseId } as CreateLessonDto).subscribe({
      next: () => {
        this.isLoading = false;
        this.lesson = { title: '', content: '', order: 1 };
        this.lessonCreated.emit();
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err?.error?.message || 'Failed to add lesson.';
      }
    });
  }
} 
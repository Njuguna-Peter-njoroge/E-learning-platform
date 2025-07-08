import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LessonService, Lesson } from '../services/lesson';
import { ModuleService } from '../services/module';
import { Module } from '../services/interface/module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lesson-view',
  standalone: true,
  imports:[CommonModule],
  template: `
    <div class="p-6 max-w-5xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">Course Lessons</h1>

      <div *ngIf="modules.length === 0" class="text-gray-500">
        📭 No modules or lessons found for this course.
      </div>

      <ng-container *ngFor="let module of modules">
        <div class="mb-6 border-b pb-4">
          <h2 class="text-xl font-semibold text-blue-700 mb-2">{{ module.title }}</h2>

          <div *ngIf="lessonsByModule[module.id]?.length; else noLessons">
            <ul>
              <li *ngFor="let lesson of lessonsByModule[module.id]" class="ml-4 mb-2 bg-white p-3 rounded shadow">
                <div class="text-lg font-medium">📘 {{ lesson.title }}</div>
                <div class="text-gray-600 mb-2">{{ lesson.content }}</div>

                <button
                  class="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                  (click)="startLesson(lesson.id)"
                >
                  Start Lesson
                </button>
              </li>
            </ul>
          </div>

          <ng-template #noLessons>
            <p class="ml-4 text-gray-500">No lessons found in this module.</p>
          </ng-template>
        </div>
      </ng-container>
    </div>
  `
})
export class LessonViewComponent implements OnInit {
  courseId = '';
  modules: Module[] = [];
  lessonsByModule: { [moduleId: string]: Lesson[] } = {};

  constructor(
    private route: ActivatedRoute,
    private moduleService: ModuleService,
    private lessonService: LessonService
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('courseId') || '';
    this.loadModulesAndLessons();
  }

  loadModulesAndLessons() {
    this.moduleService.getModulesByCourse(this.courseId).subscribe((modules: Module[]) => {
      this.modules = modules;

      modules.forEach((module: Module) => {
        this.lessonService.findByModule(module.id).subscribe((lessons: Lesson[]) => {
          this.lessonsByModule[module.id] = lessons;
        });
      });
    });
  }

  startLesson(lessonId: string): void {
    console.log(`Starting lesson ${lessonId}`);
    // Optional: Navigate to lesson detail or call a progress service
  }
}

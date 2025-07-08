import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleService } from '../../services/module';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-module-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="mt-[-320px] relative z-20 bg-white rounded-xl w-[500px]">
      <div class="p-10">
        <img src="assets/images/maroon students.jpg" alt="Course Image" class="w-full h-auto rounded" />

        <span class="flex justify-center mt-4 text-lg font-medium">Price</span>
        <h1 class="flex justify-center font-bold mt-4">11 hours left at this price</h1>

        <div class="flex justify-center mb-10">
          <button class="bg-orange-600 text-white p-2 px-8 mt-6 border rounded-xl" routerLink="/enroll-course">
            Enroll Now
          </button>
        </div>

        <hr />
        <div class="mt-10">
          <h1 class="text-xl font-bold mb-2">This Course Module</h1>

          <p *ngIf="modules.length === 0" class="text-gray-500 italic">No modules available.</p>

          <ol class="list-decimal pl-4 space-y-1">
            <li *ngFor="let module of modules">
              {{ module.title }}
            </li>
          </ol>
        </div>

        <hr class="mt-6" />
        <div class="mt-6">
          <h1 class="text-xl font-bold">This Course Instructor</h1>
          <p class="text-gray-600 italic">Coming soon...</p>
        </div>

        <hr class="mt-6" />
        <div class="mt-6">
          <h1 class="text-xl font-bold">Share this course</h1>
          <!-- Add social share buttons here -->
        </div>
      </div>
    </div>
  `
})
export class ModuleComponent implements OnInit {
  modules: any[] = [];
  private courseId: string = '';

  constructor(
    private moduleService: ModuleService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';

    console.log('Fetched courseId from route:', this.courseId);

    if (this.courseId) {
      this.moduleService.getModulesByCourse(this.courseId).subscribe({
        next: (data) => {
          console.log('Fetched modules:', data);
          this.modules = data;
        },
        error: (err) => console.error('Error loading modules:', err),
      });
    } else {
      console.warn('No courseId found in route');
    }
  }
}

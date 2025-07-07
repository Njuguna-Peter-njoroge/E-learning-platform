import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../component/header/header';
import { CourseCard } from '../course-card/course-card';
import { CourseService, Course } from '../../services/course.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, Header, CourseCard],
  template: `
    <app-header />
    <div class="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      @for (course of courses(); track course.id) {
        <app-course-card [course]="course" />
      }
    </div>
    <div>
      <div class="flex justify-between p-4">
        <h1>Recommended for you</h1>
        <button class="">See All</button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 ">
        @for (course of courses(); track course.id) {
          <app-course-card [course]="course" />
        }
      </div>
    </div>
  `,
  styles: ``
})
export class Courses implements OnInit {
  courses = signal<Course[]>([]);

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.courseService.getAllCourses().subscribe({
      next: (data) => this.courses.set(data),
      error: (err) => console.error('Error loading courses:', err)
    });
  }
}

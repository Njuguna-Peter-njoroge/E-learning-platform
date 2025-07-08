import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../component/header/header';
import { CourseCard } from '../course-card/course-card';
import { CourseService, Course  } from '../../services/course'; 

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
        <div class="ml-2 w-[300px] h-[400px] ">
          <img src="assets/images/classroom.jpg" width="270px" alt="laptop" class="w-[270px] h-[240px] p-1  mb-10">
          <h1 class="font-bold text-xl">AWS Certified solutions Architect</h1>
          <p class="mt-4 mb-6">in patnership with microsoft,amazon ,meta,openAi, freecode camp and us have been able to intoduce this course </p>
          <span class="flex justify-between p-4">
            <a href="https://www.freecodecamp.org/news/introduction-to-html-basics/">view</a>
            <h2>$80</h2>
          </span>
        </div>
        <div class="ml-4 mr-4">
          <img src="assets/images/lap in class.jpg" alt="laptop" class="w-[270px] h-[240px] border mb-10">
          <h1 class="font-bold text-xl">AWS Certified solutions Architect</h1>
          <p class="mt-4 mb-6">in patnership with microsoft,amazon ,meta,openAi, freecode camp and us have been able to intoduce this course </p>
          <span class="flex justify-between p-4">
            <a href="https://www.freecodecamp.org/news/introduction-to-html-basics/">view</a>
            <h2>$80</h2>
          </span>
        </div>
        <div>
          <img src="assets/images/classroom.jpg" alt="laptop" class="w-[270px] h-[240px] border mb-10">
          <h1 class="font-bold text-xl">AWS Certified solutions Architect</h1>
          <p class="mt-4 mb-6">in patnership with microsoft,amazon ,meta,openAi, freecode camp and us have been able to intoduce this course </p>
          <span class="flex justify-between p-3">
            <a href="https://www.freecodecamp.org/news/introduction-to-html-basics/">view</a>
            <h2>$80</h2>
          </span>
        </div>
        <div class="ml-4 mr-4 ">
          <img src="assets/images/lap in class.jpg" alt="laptop" class="w-[270px] h-[240px] border mb-10">
          <h1 class="font-bold text-xl">AWS Certified solutions Architect</h1>
          <p class="mt-4 mb-6">in patnership with microsoft,amazon ,meta,openAi, freecode camp and us have been able to intoduce this course </p>
          <span class="flex justify-between p-4">
            <a href="https://www.freecodecamp.org/news/introduction-to-html-basics/">view</a>
            <h2>$80</h2>
          </span>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class Courses implements OnInit {
  courses = signal<Course[]>([]);

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.courseService.findAll().subscribe({
      next: (data) => this.courses.set(data),
      error: (err) => console.error('Error loading courses:', err)
    });
  }
}

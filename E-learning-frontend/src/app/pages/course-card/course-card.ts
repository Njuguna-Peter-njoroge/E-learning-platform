import { Component, inject, input } from '@angular/core';
import { Courses } from '../courses/courses';
import { Course } from '../../services/course';

@Component({
  selector: 'app-course-card',
  imports: [],
  template: `
        <div class="rounded-xl shadow p-4 border border-gray-200">
        <div class="flex justify-center">
           <img [src]="course().iconImage" alt="Vehicle" class="w-[50px] bg-orange-600 h-[50px] object-cover mt-1 rounded" />
      </div>
      <div class="text-center space-y-1">
      <h2 class="text-xl font-bold mb-2">{{ course().title }}</h2>
      <p class="text-gray-600">{{ course().description }}</p>
      <p class="text-sm mt-2 italic text-gray-500">Level: {{ course().level }}</p>
      <p class="text-sm text-gray-500">Instructor: {{ course().instructor?.fullName }}</p>
    </div>
    </div>
  `,
  styles: ``
})
export class CourseCard {
  course=input.required<Course>();
  // Cart= inject (Cart)

}

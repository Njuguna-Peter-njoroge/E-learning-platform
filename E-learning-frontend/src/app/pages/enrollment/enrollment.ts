import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  EnrollmentService,
  CreateEnrollmentDto,
  UpdateEnrollmentDto
} from '../../services/enrollment';
import { Course, CourseService } from '../../services/course';
import { UserService } from '../../services/user';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

interface User {
  id: string;
  fullName: string;
  role: string;
  isVerified: boolean;
  status: string;
}

interface Enrollment {
  id: string;
  courseId: string;
  userId: string;
  progress: number;
}

@Component({
  selector: 'app-enrollment',
  standalone: true,
  imports: [CommonModule, FormsModule ],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">Enrollments</h1>

      <form (ngSubmit)="enroll()" class="mb-4 flex flex-col gap-4">
        <label class="font-semibold">Course Name:</label>
        <select [(ngModel)]="selectedCourseName" name="courseName" required class="border p-2 rounded">
          <option *ngFor="let course of publishedCourses" [value]="course.title">
            {{ course.title }}
          </option>
        </select>

        <label class="font-semibold">User Name:</label>
<select [(ngModel)]="selectedUserName" name="userName" required class="border p-2 rounded">
  <option *ngFor="let user of verifiedStudents" [value]="user.fullName">
    {{ user.fullName }}
  </option>
</select>



        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded w-fit">
          Enroll
        </button>
      </form>

      <div class="border-t pt-4">
        <h2 class="text-xl font-semibold mb-2">All Enrollments</h2>
        <div *ngFor="let enrollment of enrollments" class="border p-4 mb-2 rounded shadow">
          <p><strong>ID:</strong> {{ enrollment.id }}</p>
          <p><strong>Course:</strong> {{ getCourseName(enrollment.courseId) }}</p>
          <p><strong>User:</strong> {{ getUserName(enrollment.userId) }}</p>
          <p><strong>Progress:</strong> {{ enrollment.progress }}%</p>

          <div *ngIf="editingId !== enrollment.id" class="mt-2">
            <button (click)="startEdit(enrollment)" class="text-blue-600 mr-2">Edit</button>
            <button (click)="remove(enrollment.id)" class="text-red-600">Delete</button>
          </div>

          <div *ngIf="editingId === enrollment.id" class="mt-2">
            <input
              [(ngModel)]="updateDto.progress"
              name="progress"
              type="number"
              min="0"
              max="100"
              class="border p-1 mr-2 w-[80px]"
              placeholder="Progress"
            />
            <button (click)="submitUpdate(enrollment.id)" class="bg-green-500 text-white px-2 py-1 rounded mr-2">
              Save
            </button>
            <button (click)="cancelEdit()" class="bg-gray-400 text-white px-2 py-1 rounded">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EnrollmentComponent implements OnInit {
  enrollments: Enrollment[] = [];
  courses: Course[] = [];
  users: User[] = [];

  selectedCourseName = '';
  selectedUserName = '';

  updateDto: UpdateEnrollmentDto = {};
  editingId: string | null = null;

  constructor(
    private enrollmentService: EnrollmentService,
    private courseService: CourseService,
    private userService: UserService,
    private router: Router
  ) {}

  get publishedCourses(): Course[] {
    return this.courses.filter(course => course.status === 'PUBLISHED');
  }

  get verifiedStudents(): User[] {
    return this.users.filter(user =>
      user.role === 'STUDENT' && user.status === 'ACTIVE'
      
    );
    

    
  }

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.enrollmentService.findAll().subscribe({
      next: (data) => (this.enrollments = data),
      error: (err: HttpErrorResponse) => alert(' Failed to load enrollments: ' + err.message)
    });

    this.courseService.findAll().subscribe({
      next: (data) => (this.courses = data),
      error: (err: HttpErrorResponse) => alert(' Failed to load courses: ' + err.message)
    });

    this.userService.findAll().subscribe({
      next: (res: any) => {
        console.log(' Users fetched:', res);
        this.users = res.data; 
      },
      error: (err: HttpErrorResponse) => {
        alert(' Failed to load users: ' + err.message);
      }
    });
    

  }

  enroll(): void {
    const trimmedUserInput = this.selectedUserName.trim().toLowerCase();
    const trimmedCourseInput = this.selectedCourseName.trim().toLowerCase();
  
    const course = this.publishedCourses.find(
      c => c.title.trim().toLowerCase() === trimmedCourseInput
    );
    const user = this.verifiedStudents.find(
      u => u.fullName.trim().toLowerCase() === trimmedUserInput
    );
  
    if (!course) {
      alert(` Course "${this.selectedCourseName}" not found.`);
      return;
    }
  
    if (!user) {
      alert(` User "${this.selectedUserName}" not found.`);
      return;
    }
  
    // Prevent duplicate enrollment
    const alreadyEnrolled = this.enrollments.some(
      e => e.userId === user.id && e.courseId === course.id
    );
  
    if (alreadyEnrolled) {
      alert(` ${user.fullName} is already enrolled in "${course.title}".`);
      return;
    }
  
    const dto: CreateEnrollmentDto = {
      courseId: course.id,
      userId: user.id
    };
  
    this.enrollmentService.create(dto).subscribe({
      next: () => {
        alert(` ${user.fullName} successfully enrolled in "${course.title}"`);
        this.selectedCourseName = '';
        this.selectedUserName = '';
        this.loadAll();
        this.router.navigate(['/courses', course.id, 'lessons']); 
      },
      error: (err: HttpErrorResponse) =>
        alert(' Failed to enroll: ' + err.message)
    });
    
  }
  

  remove(id: string): void {
    if (!confirm('Are you sure you want to delete this enrollment?')) return;

    this.enrollmentService.remove(id).subscribe({
      next: () => this.loadAll(),
      error: (err: HttpErrorResponse) => alert(' Failed to delete enrollment: ' + err.message)
    });
  }

  startEdit(enrollment: Enrollment): void {
    this.editingId = enrollment.id;
    this.updateDto = {
      progress: enrollment.progress
    };
  }

  submitUpdate(id: string): void {
    if (this.updateDto.progress === undefined || this.updateDto.progress === null) return;

    this.enrollmentService.update(id, this.updateDto).subscribe({
      next: () => {
        this.editingId = null;
        this.loadAll();
      },
      error: (err: HttpErrorResponse) => alert(' Failed to update enrollment: ' + err.message)
    });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.updateDto = {};
  }

  getCourseName(courseId: string): string {
    return this.courses.find(c => c.id === courseId)?.title || courseId;
  }

  getUserName(userId: string): string {
    return this.users.find(u => u.id === userId)?.fullName || userId;
  }
}

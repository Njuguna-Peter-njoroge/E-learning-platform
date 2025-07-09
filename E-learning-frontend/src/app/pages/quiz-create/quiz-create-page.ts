import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizCreateComponent } from './quiz-create';

@Component({
  selector: 'app-quiz-create-page',
  template: `
    <app-quiz-create [courseId]="courseId"></app-quiz-create>
  `,
  standalone: true,
  imports: [QuizCreateComponent]
})
export class QuizCreatePageComponent implements OnInit {
  courseId: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('courseId') || '';
  }
} 
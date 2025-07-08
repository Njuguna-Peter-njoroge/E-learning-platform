import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { QuizService, FullQuiz } from '../../services/quiz';
import { RouterModule } from '@angular/router';
import { Header } from '../../component/header/header';
import { Input, Output, EventEmitter } from '@angular/core';

export interface QuizQuestion {
  id: string;
  questionText: string;
  type: 'multiple-choice' | 'short-answer';
  choices?: string[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  courseId: string;
  questions: QuizQuestion[];
}

@Component({
  selector: 'app-quiz-take',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 class="text-2xl font-bold mb-4">{{ quiz?.title }}</h2>
      <p class="mb-6 text-gray-600">{{ quiz?.description }}</p>
      <form (ngSubmit)="submitQuiz()">
        <div *ngFor="let q of quiz?.questions; let i = index" class="mb-6">
          <div class="font-semibold mb-2">Q{{ i + 1 }}: {{ q.questionText }}</div>
          <ng-container [ngSwitch]="q.type">
            <div *ngSwitchCase="'multiple-choice'">
              <div *ngFor="let choice of q.choices; let ci = index">
                <label class="flex items-center gap-2">
                  <input type="radio" [name]="'q' + i" [value]="choice" [(ngModel)]="answers[q.id]" required />
                  {{ choice }}
                </label>
              </div>
            </div>
            <div *ngSwitchCase="'short-answer'">
              <input type="text" class="border rounded w-full p-2" [(ngModel)]="answers[q.id]" [name]="'q' + i" required />
            </div>
          </ng-container>
        </div>
        <button type="submit" class="bg-orange-600 text-white px-4 py-2 rounded" [disabled]="isSubmitting">Submit Quiz</button>
        <div *ngIf="error" class="text-red-600 mt-2">{{ error }}</div>
      </form>
      <div *ngIf="submitted" class="text-green-600 mt-4">Quiz submitted! Thank you.</div>
    </div>
  `
})
export class QuizTakeComponent {
  @Input() quiz!: FullQuiz;
  @Output() quizSubmitted = new EventEmitter<any>();
  answers: { [questionId: string]: string } = {};
  isSubmitting = false;
  error: string | null = null;
  submitted = false;

  submitQuiz() {
    this.isSubmitting = true;
    this.error = null;
    // Simulate API call or emit answers
    setTimeout(() => {
      this.isSubmitting = false;
      this.submitted = true;
      this.quizSubmitted.emit(this.answers);
    }, 1000);
  }
}

@Component({
  selector: 'app-quiz-take-page',
  standalone: true,
  templateUrl: './quiz-take.html',
  imports: [CommonModule, RouterModule, Header, QuizTakeComponent],
})
export class QuizTakePageComponent implements OnInit {
  quizzes: FullQuiz[] = [];
  selectedQuiz: FullQuiz | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private quizService: QuizService) {}

  ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('courseId');
    if (courseId) {
      this.quizService.getQuizzesByCourse(courseId).subscribe({
        next: (quizzes) => {
          this.quizzes = quizzes;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = err?.error?.message || 'Failed to load quizzes.';
          this.isLoading = false;
        }
      });
    } else {
      this.error = 'No course ID provided.';
      this.isLoading = false;
    }
  }

  selectQuiz(quiz: FullQuiz) {
    this.selectedQuiz = quiz;
  }

  onQuizSubmitted() {
    // Optionally show a message or refresh the list
    this.selectedQuiz = null;
  }
}

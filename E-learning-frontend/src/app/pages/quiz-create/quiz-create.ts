import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizService, CreateQuizDto } from '../../services/quiz';

@Component({
  selector: 'app-quiz-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-gray-100 p-4 rounded mb-4">
      <h3 class="font-bold mb-2">Add Quiz</h3>
      <form (ngSubmit)="addQuiz()">
        <div class="mb-2">
          <input type="text" class="border rounded w-full p-2" [(ngModel)]="quiz.title" name="title" placeholder="Quiz Title" required />
        </div>
        <div class="mb-2">
          <textarea class="border rounded w-full p-2" [(ngModel)]="quiz.description" name="description" placeholder="Quiz Description" required></textarea>
        </div>
        <div class="mb-4">
          <h4 class="font-semibold mb-2">Questions</h4>
          <div *ngFor="let q of questions; let qi = index" class="mb-4 p-2 bg-white rounded shadow">
            <div class="flex justify-between items-center mb-2">
              <span class="font-semibold">Q{{ qi + 1 }}</span>
              <button type="button" class="text-red-600 text-xs" (click)="removeQuestion(qi)">Remove</button>
            </div>
            <input type="text" class="border rounded w-full p-2 mb-2" [(ngModel)]="q.questionText" [name]="'questionText' + qi" placeholder="Question text" required />
            <select class="border rounded w-full p-2 mb-2" [(ngModel)]="q.type" [name]="'type' + qi" required>
              <option value="multiple-choice">Multiple Choice</option>
              <option value="short-answer">Short Answer</option>
            </select>
            <div *ngIf="q.type === 'multiple-choice'">
              <div *ngFor="let choice of q.choices; let ci = index" class="flex items-center mb-1">
                <input type="text" class="border rounded p-1 flex-1" [(ngModel)]="q.choices[ci]" [name]="'choice' + qi + '_' + ci" placeholder="Choice {{ ci + 1 }}" required />
                <input type="radio" [(ngModel)]="q.correctAnswer" [value]="ci" [name]="'correct' + qi" class="ml-2" />
                <span class="ml-1 text-xs">Correct</span>
                <button type="button" class="ml-2 text-red-500" (click)="removeChoice(qi, ci)">✕</button>
              </div>
              <button type="button" class="bg-gray-200 text-xs px-2 py-1 rounded mt-1" (click)="addChoice(qi)">Add Choice</button>
            </div>
          </div>
          <button type="button" class="bg-orange-600 text-white px-3 py-1 rounded mt-2" (click)="addQuestion()">Add Question</button>
        </div>
        <button type="submit" class="bg-orange-600 text-white px-4 py-2 rounded" [disabled]="isLoading">Add Quiz</button>
        <span *ngIf="error" class="text-red-600 ml-2">{{ error }}</span>
      </form>
    </div>
  `
})
export class QuizCreateComponent {
  @Input() courseId!: string;
  @Output() quizCreated = new EventEmitter<void>();
  quiz: Partial<CreateQuizDto> = { title: '', description: '' };
  isLoading = false;
  error: string | null = null;

  questions: any[] = [];

  constructor(private quizService: QuizService) {}

  addQuestion() {
    this.questions.push({
      questionText: '',
      type: 'multiple-choice',
      choices: ['',''],
      correctAnswer: 0
    });
  }

  removeQuestion(index: number) {
    this.questions.splice(index, 1);
  }

  addChoice(qi: number) {
    this.questions[qi].choices.push('');
  }

  removeChoice(qi: number, ci: number) {
    this.questions[qi].choices.splice(ci, 1);
    if (this.questions[qi].correctAnswer >= this.questions[qi].choices.length) {
      this.questions[qi].correctAnswer = 0;
    }
  }

  addQuiz() {
    if (!this.courseId) return;
    if (!this.quiz.title || !this.quiz.description || this.questions.length === 0) {
      this.error = 'Quiz title, description, and at least one question are required.';
      return;
    }
    // Validate questions
    for (const q of this.questions) {
      if (!q.questionText || !q.type) {
        this.error = 'All questions must have text and type.';
        return;
      }
      if (q.type === 'multiple-choice') {
        if (!q.choices || q.choices.length < 2 || q.choices.some((c: string) => !c)) {
          this.error = 'Each multiple choice question must have at least 2 choices, all filled.';
          return;
        }
      }
    }
    this.isLoading = true;
    this.error = null;
    const quizPayload = {
      ...this.quiz,
      courseId: this.courseId,
      questions: this.questions.map(q => ({
        questionText: q.questionText,
        type: q.type,
        choices: q.type === 'multiple-choice' ? q.choices : undefined,
        correctAnswer: q.type === 'multiple-choice' ? q.choices[q.correctAnswer] : undefined
      }))
    };
    this.quizService.create(quizPayload as any).subscribe({
      next: () => {
        this.isLoading = false;
        this.quiz = { title: '', description: '' };
        this.questions = [];
        this.quizCreated.emit();
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err?.error?.message || 'Failed to add quiz.';
      }
    });
  }
} 
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizService, CreateQuizDto } from '../../services/quiz';

@Component({
  selector: 'app-quiz-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div class="border-b border-gray-200 pb-4 mb-6">
        <h3 class="text-2xl font-bold text-gray-800 mb-2">Create New Quiz</h3>
        <p class="text-gray-600">Add a comprehensive quiz to test your students' knowledge</p>
      </div>
      
      <form (ngSubmit)="addQuiz()" class="space-y-6">
        <!-- Quiz Basic Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
            <input 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
              [(ngModel)]="quiz.title" 
              name="title" 
              placeholder="Enter quiz title" 
              required 
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Course ID</label>
            <input 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" 
              [value]="courseId" 
              readonly 
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Quiz Description</label>
          <textarea 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
            [(ngModel)]="quiz.description" 
            name="description" 
            placeholder="Describe what this quiz covers..." 
            rows="3"
            required
          ></textarea>
        </div>

        <!-- Questions Section -->
        <div class="border-t border-gray-200 pt-6">
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-lg font-semibold text-gray-800">Questions ({{ questions.length }})</h4>
            <button 
              type="button" 
              class="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors duration-200 flex items-center gap-2"
              (click)="addQuestion()"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Add Question
            </button>
          </div>
          
          <div *ngIf="questions.length === 0" class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p>No questions added yet. Click "Add Question" to get started.</p>
          </div>

          <div *ngFor="let q of questions; let qi = index" class="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
            <div class="flex justify-between items-center mb-3">
              <span class="text-lg font-semibold text-gray-800">Question {{ qi + 1 }}</span>
              <button 
                type="button" 
                class="text-red-600 hover:text-red-800 transition-colors duration-200 p-1"
                (click)="removeQuestion(qi)"
                title="Remove question"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
            
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                <input 
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  [(ngModel)]="q.questionText" 
                  [name]="'questionText' + qi" 
                  placeholder="Enter your question..." 
                  required 
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                <select 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  [(ngModel)]="q.type" 
                  [name]="'type' + qi" 
                  required
                >
                  <option value="MCQ">Multiple Choice</option>
                  <option value="SHORT_ANSWER">Short Answer</option>
                </select>
              </div>
              
              <div *ngIf="q.type === 'MCQ'" class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Choices</label>
                <div *ngFor="let choice of q.choices; let ci = index" class="flex items-center gap-2">
                  <input 
                    type="text" 
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    [(ngModel)]="choice.text" 
                    [name]="'choice' + qi + '_' + ci" 
                    placeholder="Choice {{ ci + 1 }}" 
                    required 
                  />
                  <input 
                    type="radio" 
                    [(ngModel)]="q.correctAnswer" 
                    [value]="choice.text" 
                    [name]="'correct' + qi" 
                    class="text-orange-600 focus:ring-orange-500" 
                  />
                  <span class="text-sm text-gray-600">Correct</span>
                  <button 
                    type="button" 
                    class="text-red-500 hover:text-red-700 p-1" 
                    (click)="removeChoice(qi, ci)"
                    title="Remove choice"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <button 
                  type="button" 
                  class="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-1" 
                  (click)="addChoice(qi)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Add Choice
                </button>
              </div>

              <div *ngIf="q.type === 'SHORT_ANSWER'">
                <label class="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                <input 
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  [(ngModel)]="q.correctAnswer" 
                  [name]="'correctAnswer' + qi" 
                  placeholder="Enter the correct answer..." 
                  required 
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Section -->
        <div class="border-t border-gray-200 pt-6">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600">
              <span class="font-medium">{{ questions.length }}</span> questions ready
            </div>
            <button 
              type="submit" 
              class="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition-colors duration-200 font-medium flex items-center gap-2" 
              [disabled]="isLoading || !isInstructor"
            >
              <svg *ngIf="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'Creating Quiz...' : 'Create Quiz' }}
            </button>
          </div>
          
          <div *ngIf="!isInstructor" class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div class="flex">
              <svg class="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <span class="text-yellow-800">Only instructors can create quizzes.</span>
            </div>
          </div>
          
          <div *ngIf="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div class="flex">
              <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-red-800">{{ error }}</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  `
})
export class QuizCreateComponent implements OnInit {
  @Input() courseId!: string;
  @Output() quizCreated = new EventEmitter<void>();
  quiz: Partial<CreateQuizDto> = { title: '', description: '' };
  isLoading = false;
  error: string | null = null;
  isInstructor = false;

  questions: any[] = [];

  constructor(private quizService: QuizService) {}

  ngOnInit() {
    // Check if user is instructor
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      this.isInstructor = user.role === 'INSTRUCTOR' || user.role === 'ADMIN';
    }
  }

  addQuestion() {
    this.questions.push({
      questionText: '',
      type: 'MCQ',
      choices: [{ text: '' }, { text: '' }],
      correctAnswer: ''
    });
  }

  removeQuestion(index: number) {
    this.questions.splice(index, 1);
  }

  addChoice(qi: number) {
    this.questions[qi].choices.push({ text: '' });
  }

  removeChoice(qi: number, ci: number) {
    this.questions[qi].choices.splice(ci, 1);
    // Reset correct answer if the removed choice was selected
    if (this.questions[qi].choices.length > 0 && !this.questions[qi].choices.find((c: any) => c.text === this.questions[qi].correctAnswer)) {
      this.questions[qi].correctAnswer = this.questions[qi].choices[0].text;
    }
  }

  addQuiz() {
    if (!this.isInstructor) {
      this.error = 'Only instructors can create quizzes.';
      return;
    }

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
      if (q.type === 'MCQ') {
        if (!q.choices || q.choices.length < 2 || q.choices.some((c: any) => !c.text)) {
          this.error = 'Each multiple choice question must have at least 2 choices, all filled.';
          return;
        }
        if (!q.correctAnswer) {
          this.error = 'Each multiple choice question must have a correct answer selected.';
          return;
        }
      } else if (q.type === 'SHORT_ANSWER') {
        if (!q.correctAnswer) {
          this.error = 'Each short answer question must have a correct answer.';
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
        choices: q.type === 'MCQ' ? q.choices : undefined,
        correctAnswer: q.correctAnswer
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
        this.error = err?.error?.message || 'Failed to create quiz.';
      }
    });
  }
} 
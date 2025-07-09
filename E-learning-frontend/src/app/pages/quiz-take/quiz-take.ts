import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService, FullQuiz, QuizQuestion, QuizSubmission } from '../../services/quiz';
import { RouterModule } from '@angular/router';
import { Header } from '../../component/header/header';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-quiz-take',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <!-- Quiz Header -->
      <div class="border-b border-gray-200 pb-6 mb-6">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-3xl font-bold text-gray-800 mb-2">{{ quiz.title }}</h2>
            <p class="text-gray-600 text-lg">{{ quiz.description }}</p>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-500">Progress</div>
            <div class="text-2xl font-bold text-orange-600">{{ getProgressPercentage() }}%</div>
          </div>
        </div>
        <!-- Progress Bar -->
        <div class="mt-4">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-orange-600 h-2 rounded-full transition-all duration-300" [style.width.%]="getProgressPercentage()"></div>
          </div>
          <div class="flex justify-between text-sm text-gray-500 mt-1">
            <span>{{ getAnsweredCount() }} of {{ quiz.questions.length || 0 }} questions answered</span>
            <span>{{ getRemainingTime() }}</span>
          </div>
        </div>
      </div>

      <!-- One Question at a Time -->
      <form (ngSubmit)="submitQuiz()" class="space-y-8">
        <div *ngIf="currentQuestion as q" class="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold text-gray-800">Question {{ currentQuestionIndex + 1 }} of {{ quiz.questions.length }}</h3>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500">{{ q.type === 'multiple-choice' ? (isMultiAnswer(q) ? 'Multiple Answers' : 'Single Answer') : 'Short Answer' }}</span>
              <div class="w-3 h-3 rounded-full" [class]="isQuestionAnswered(q.id) ? 'bg-green-500' : 'bg-gray-300'"></div>
            </div>
          </div>
          <p class="text-lg text-gray-700 mb-4">{{ q.questionText }}</p>
          <ng-container [ngSwitch]="q.type">
            <div *ngSwitchCase="'multiple-choice'" class="space-y-3">
              <!-- Checkboxes for multiple answers, radio for single answer -->
              <div *ngIf="isMultiAnswer(q); else singleAnswerBlock">
                <div *ngFor="let choice of q.choices; let ci = index" class="flex items-center">
                  <input type="checkbox"
                    [id]="'choice' + currentQuestionIndex + '_' + ci"
                    [checked]="isChoiceChecked(q, choice)"
                    (change)="toggleCheckboxAnswer(q.id, choice)"
                    class="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                  />
                  <label [for]="'choice' + currentQuestionIndex + '_' + ci" class="ml-3 text-gray-700 cursor-pointer hover:text-gray-900">
                    {{ choice }}
                  </label>
                </div>
              </div>
              <ng-template #singleAnswerBlock>
                <div *ngFor="let choice of q.choices; let ci = index" class="flex items-center">
                  <input type="radio"
                    [name]="'q' + currentQuestionIndex"
                    [value]="choice"
                    [(ngModel)]="answers[q.id]"
                    [id]="'choice' + currentQuestionIndex + '_' + ci"
                    class="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                    required
                  />
                  <label [for]="'choice' + currentQuestionIndex + '_' + ci" class="ml-3 text-gray-700 cursor-pointer hover:text-gray-900">
                    {{ choice }}
                  </label>
                </div>
              </ng-template>
            </div>
            <div *ngSwitchCase="'short-answer'" class="space-y-3">
              <textarea class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                [(ngModel)]="answers[q.id]"
                [name]="'q' + currentQuestionIndex"
                placeholder="Type your answer here..."
                rows="3"
                required
              ></textarea>
            </div>
          </ng-container>
        </div>
        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-6">
          <button type="button" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg" (click)="prevQuestion()" [disabled]="currentQuestionIndex === 0">Previous</button>
          <button type="button" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg" (click)="nextQuestion()" [disabled]="currentQuestionIndex === quiz.questions.length - 1">Next</button>
        </div>
        <!-- Submit Section -->
        <div class="border-t border-gray-200 pt-6">
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-600">
              <span class="font-medium">{{ getAnsweredCount() }}</span> of <span class="font-medium">{{ quiz.questions.length || 0 }}</span> questions completed
            </div>
            <div class="flex gap-3">
              <button type="button" class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200" (click)="saveProgress()">Save Progress</button>
              <button type="submit" class="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium flex items-center gap-2" [disabled]="isSubmitting || !isQuizComplete()">
                <svg *ngIf="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmitting ? 'Submitting...' : 'Submit Quiz' }}
              </button>
            </div>
          </div>
          <div *ngIf="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex">
              <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-red-800">{{ error }}</span>
            </div>
          </div>
        </div>
      </form>
      <!-- Completion Modal -->
      <div *ngIf="submitted" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Quiz Completed!</h3>
          <p class="text-gray-600 mb-6">Your quiz has been submitted successfully. Your instructor will review your answers.</p>
          <button class="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200" (click)="onQuizCompleted()">Continue</button>
        </div>
      </div>
    </div>
  `
})
export class QuizTakeComponent {
  @Input() quiz!: FullQuiz;
  @Output() quizSubmitted = new EventEmitter<any>();
  answers: { [questionId: string]: string | string[] } = {};
  isSubmitting = false;
  error: string | null = null;
  submitted = false;
  startTime = new Date();
  quizScore: number = 0;
  correctAnswers: number = 0;
  totalQuestions: number = 0;
  currentQuestionIndex = 0;

  constructor(private quizService: QuizService) {}

  get currentQuestion() {
    return this.quiz?.questions?.[this.currentQuestionIndex];
  }

  isMultiAnswer(q: QuizQuestion): boolean {
    return !!q.answers && q.answers.length > 1;
  }

  isChoiceChecked(q: QuizQuestion, choice: string): boolean {
    const ans = this.answers[q.id];
    return Array.isArray(ans) && ans.includes(choice);
  }

  getProgressPercentage(): number {
    if (!this.quiz?.questions) return 0;
    return Math.round((this.getAnsweredCount() / this.quiz.questions.length) * 100);
  }

  getAnsweredCount(): number {
    if (!this.quiz?.questions) return 0;
    return this.quiz.questions.filter(q => this.isQuestionAnswered(q.id)).length;
  }

  isQuestionAnswered(questionId: string): boolean {
    const ans = this.answers[questionId];
    if (Array.isArray(ans)) return ans.length > 0;
    return !!ans;
  }

  isQuizComplete(): boolean {
    if (!this.quiz?.questions) return false;
    return this.getAnsweredCount() === this.quiz.questions.length;
  }

  getRemainingTime(): string {
    const elapsed = Math.floor((new Date().getTime() - this.startTime.getTime()) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  saveProgress() {
    localStorage.setItem(`quiz_progress_${this.quiz.id}`, JSON.stringify(this.answers));
    this.error = null;
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.quiz.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  toggleCheckboxAnswer(questionId: string, choice: string) {
    let arr = Array.isArray(this.answers[questionId]) ? [...(this.answers[questionId] as string[])] : [];
    if (arr.includes(choice)) {
      arr = arr.filter(c => c !== choice);
    } else {
      arr.push(choice);
    }
    this.answers[questionId] = arr;
  }

  submitQuiz() {
    if (!this.isQuizComplete()) {
      this.error = 'Please answer all questions before submitting.';
      return;
    }
    this.isSubmitting = true;
    this.error = null;
    const submission: QuizSubmission = {
      quizId: this.quiz.id,
      answers: this.answers,
      timeSpent: new Date().getTime() - this.startTime.getTime(),
      completedAt: new Date().toISOString()
    };
    this.quizService.submitQuizCompletion(submission).subscribe({
      next: (result: any) => {
        this.isSubmitting = false;
        this.submitted = true;
        this.quizSubmitted.emit(submission);
        this.quizScore = result.score;
        this.correctAnswers = result.correctAnswers;
        this.totalQuestions = result.totalQuestions;
        localStorage.removeItem(`quiz_progress_${this.quiz.id}`);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.error = err?.error?.message || 'Failed to submit quiz. Please try again.';
      }
    });
  }

  onQuizCompleted() {
    this.submitted = false;
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
  isEnrolled = false;
  isEnrolling = false;
  enrollmentError: string | null = null;
  courseId: string = '';
  // Add these for completion modal
  submitted = false;
  quizScore: number = 0;
  correctAnswers: number = 0;
  totalQuestions: number = 0;

  constructor(
    public route: ActivatedRoute, 
    private router: Router,
    private quizService: QuizService,
    private studentService: StudentService
  ) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('courseId') || '';
    if (this.courseId) {
      this.checkEnrollmentAndLoadQuizzes(this.courseId);
    } else {
      this.error = 'No course ID provided.';
      this.isLoading = false;
    }
  }

  async checkEnrollmentAndLoadQuizzes(courseId: string) {
    try {
      // Check if student is enrolled in the course
      this.isEnrolled = await this.checkEnrollment(courseId);
      
      if (this.isEnrolled) {
        this.loadQuizzes(courseId);
      } else {
        // Show enrollment prompt
        this.isLoading = false;
      }
    } catch (err) {
      this.error = 'Failed to check enrollment status.';
      this.isLoading = false;
    }
  }

  async checkEnrollment(courseId: string): Promise<boolean> {
    // This would typically check enrollment status from backend
    // For now, we'll assume enrolled if we can access the quizzes
    return true;
  }

  loadQuizzes(courseId: string) {
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
  }

  enrollInCourse(courseId: string | null) {
    if (!courseId) {
      this.enrollmentError = 'Course ID is required.';
      return;
    }
    
    this.isEnrolling = true;
    this.enrollmentError = null;

    this.studentService.enrollInCourse(courseId).subscribe({
      next: () => {
        this.isEnrolled = true;
        this.isEnrolling = false;
        this.loadQuizzes(courseId);
      },
      error: (err) => {
        this.isEnrolling = false;
        this.enrollmentError = err?.error?.message || 'Failed to enroll in course.';
      }
    });
  }

  selectQuiz(quiz: FullQuiz) {
    this.selectedQuiz = quiz;
    // Reset modal state when starting a new quiz
    this.submitted = false;
    this.quizScore = 0;
    this.correctAnswers = 0;
    this.totalQuestions = 0;
  }

  onQuizSubmitted(submission: any) {
    // The child should emit an object with score, correctAnswers, totalQuestions
    this.submitted = true;
    this.quizScore = submission.score ?? 0;
    this.correctAnswers = submission.correctAnswers ?? 0;
    this.totalQuestions = submission.totalQuestions ?? 0;
    // Optionally, deselect the quiz if you want to hide the quiz UI
    // this.selectedQuiz = null;
  }

  onQuizCompleted() {
    this.submitted = false;
    this.selectedQuiz = null;
  }

  getEstimatedTime(quiz: FullQuiz): string {
    const questionCount = quiz.questions?.length || 0;
    const estimatedMinutes = Math.ceil(questionCount * 2); // 2 minutes per question
    return `${estimatedMinutes} min`;
  }

  getCourseName(courseId: string): string {
    // This would typically fetch from a service
    // For now, return a placeholder
    return 'Course Name';
  }

  goBack() {
    this.router.navigate(['/courses']);
  }
}

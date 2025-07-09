import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateQuizDto {
  title: string;
  description: string;
  courseId: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  courseId: string;
  createdAt?: string;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  type: 'multiple-choice' | 'short-answer';
  choices?: string[];
  answers?: string[]; // For MCQ, multiple correct answers
  correctAnswer?: string; // For short-answer
}

export interface FullQuiz extends Quiz {
  questions: QuizQuestion[];
}

export interface QuizSubmission {
  quizId: string;
  answers: { [questionId: string]: string | string[] };
  timeSpent: number;
  completedAt: string;
}

export interface QuizProgress {
  quizId: string;
  userId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  timeSpent?: number;
  completedAt?: string;
  score?: number;
}

@Injectable({ providedIn: 'root' })
export class QuizService {
  private readonly apiUrl = 'http://localhost:3000/quizzes';

  constructor(private http: HttpClient) {}

  create(dto: CreateQuizDto): Observable<Quiz> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post<Quiz>(this.apiUrl, dto, { headers });
  }

  getQuizzesByCourse(courseId: string): Observable<FullQuiz[]> {
    return this.http.get<FullQuiz[]>(`${this.apiUrl}/course/${courseId}`);
  }

  getQuizById(quizId: string): Observable<FullQuiz> {
    return this.http.get<FullQuiz>(`${this.apiUrl}/${quizId}`);
  }

  submitQuizAnswers(quizId: string, answers: any): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/${quizId}/submit`, answers, { headers });
  }

  // New methods for quiz completion tracking
  submitQuizCompletion(submission: QuizSubmission): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/${submission.quizId}/complete`, submission, { headers });
  }

  getQuizProgress(quizId: string): Observable<QuizProgress> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<QuizProgress>(`${this.apiUrl}/${quizId}/progress`, { headers });
  }

  getStudentQuizProgress(courseId: string): Observable<QuizProgress[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<QuizProgress[]>(`${this.apiUrl}/course/${courseId}/progress`, { headers });
  }

  // For instructors to view student quiz progress
  getInstructorQuizProgress(courseId: string): Observable<any[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/course/${courseId}/instructor-progress`, { headers });
  }

  saveQuizProgress(quizId: string, progress: Partial<QuizProgress>): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.patch(`${this.apiUrl}/${quizId}/progress`, progress, { headers });
  }
} 
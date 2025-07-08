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
}

export interface FullQuiz extends Quiz {
  questions: QuizQuestion[];
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
} 
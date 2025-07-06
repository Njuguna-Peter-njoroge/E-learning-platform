import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateReviewDto {
  rating: number;
  comment: string;
  courseId: string;
}

export interface UpdateReviewDto {
  rating?: number;
  comment?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:3000/reviews'; // Replace with your actual backend URL

  constructor(private http: HttpClient) {}

  createReview(dto: CreateReviewDto): Observable<any> {
    return this.http.post(`${this.apiUrl}`, dto);
  }

  getReviewsByCourse(courseId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/course/${courseId}`);
  }

  updateReview(id: string, dto: UpdateReviewDto): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, dto);
  }

  deleteReview(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  approveReview(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectReview(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/reject`, {});
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { ReviewService, CreateReviewDto, UpdateReviewDto } from '../../services/review'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-review-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- <div class="grid grid-cols-[700px,500px] gap-20 px-20"> -->
      <!-- Left Side: Ratings Summary -->
      <div>
        <h1 class="bg-gray-500 flex justify-center border rounded-xl text-xl font-bold mt-10">
          Ratings And Reviews
        </h1>

        <div class="mt-10 bg-gray-300 h-[400px] rounded-xl">
          <div class="grid grid-cols-[200px,350px] gap-4">
            <div class="border bg-white rounded-xl m-4">
              <h1 class="flex justify-center text-2xl font-semibold mt-10">
                {{ averageRating.toFixed(1) }} of 5
              </h1>
              <h1 class="mt-20 flex justify-center font-medium">Top Rating</h1>
            </div>
            <div class="mt-6">
              <ng-container *ngFor="let star of [5,4,3,2,1]">
                <label class="font-medium">{{ star }} stars</label>
                <input
                  type="range"
                  [value]="getStarPercentage(star)"
                  disabled
                  class="w-full accent-yellow-500"
                />
              </ng-container>
            </div>
          </div>
        </div>
       </div> 

      <!-- Right Side: Add & List Reviews -->
      <div>
        <h2 class="text-xl font-semibold mb-4 mt-10">Leave a Review</h2>
        <div class="mb-6">
          <input
            type="number"
            [(ngModel)]="newReview.rating"
            placeholder="Rating (1-5)"
            min="1"
            max="5"
            class="border p-2 mr-2"
          />
          <input
            type="text"
            [(ngModel)]="newReview.comment"
            placeholder="Comment"
            class="border p-2 mr-2"
          />
          <button (click)="submitReview()" class="bg-blue-500 text-white px-4 py-2 rounded">
            Submit
          </button>
        </div>

        <div *ngFor="let review of reviews" class="mb-4 border-b pb-2">
          <div *ngIf="editingReviewId !== review.id">
            <p><strong>Rating:</strong> {{ review.rating }}</p>
            <p><strong>Comment:</strong> {{ review.comment }}</p>
            <button (click)="startEdit(review)" class="text-blue-600 mr-2">Edit</button>
            <button (click)="deleteReview(review.id)" class="text-red-600">Delete</button>
          </div>

          <div *ngIf="editingReviewId === review.id">
            <input
              type="number"
              [(ngModel)]="updateDto.rating"
              class="border p-1 mr-2"
              min="1"
              max="5"
            />
            <input
              type="text"
              [(ngModel)]="updateDto.comment"
              class="border p-1 mr-2"
            />
            <button (click)="submitUpdate()" class="bg-green-500 text-white px-2 py-1 rounded mr-2">
              Save
            </button>
            <button (click)="cancelEdit()" class="bg-gray-400 text-white px-2 py-1 rounded">
              Cancel
            </button>
          </div>
        </div>
      </div>
    <!-- </div> -->
  `
})
export class ReviewComponentComponent implements OnInit {
  courseId!: string;

  reviews: any[] = [];
  newReview: CreateReviewDto = {
    rating: 0,
    comment: '',
    courseId: ''
  };

  editingReviewId: string | null = null;
  updateDto: UpdateReviewDto = {};

  averageRating: number = 0;
  starCounts: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  constructor(
    private reviewService: ReviewService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id')!;
    if (this.courseId) {
      this.loadReviews();
    }
  }

  loadReviews(): void {
    this.reviewService.getReviewsByCourse(this.courseId).subscribe({
      next: (data) => {
        this.reviews = data;
        this.calculateStats();
      },
      error: (err) => console.error('Error loading reviews:', err)
    });
  }

  submitReview(): void {
    this.newReview.courseId = this.courseId;
    this.reviewService.createReview(this.newReview).subscribe({
      next: () => {
        this.newReview = { rating: 0, comment: '', courseId: '' };
        this.loadReviews();
      },
      error: (err) => console.error('Error submitting review:', err)
    });
  }

  startEdit(review: any): void {
    this.editingReviewId = review.id;
    this.updateDto = {
      rating: review.rating,
      comment: review.comment
    };
  }

  submitUpdate(): void {
    if (!this.editingReviewId) return;

    this.reviewService.updateReview(this.editingReviewId, this.updateDto).subscribe({
      next: () => {
        this.editingReviewId = null;
        this.loadReviews();
      },
      error: (err) => console.error('Error updating review:', err)
    });
  }

  cancelEdit(): void {
    this.editingReviewId = null;
  }

  deleteReview(id: string): void {
    this.reviewService.deleteReview(id).subscribe({
      next: () => this.loadReviews(),
      error: (err) => console.error('Error deleting review:', err)
    });
  }

  calculateStats(): void {
    let total = 0;
    let count = this.reviews.length;
    this.starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    for (let review of this.reviews) {
      total += review.rating;
      this.starCounts[review.rating]++;
    }

    this.averageRating = count > 0 ? total / count : 0;
  }

  getStarPercentage(star: number): number {
    const total = this.reviews.length;
    return total ? (this.starCounts[star] / total) * 100 : 0;
  }
}
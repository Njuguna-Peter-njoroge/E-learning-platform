export class ReviewResponseDto {
    id: string;
    rating: number;
    comment: string;
    courseId: string;
    userId: string;
    createdAt: Date;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
  }
  
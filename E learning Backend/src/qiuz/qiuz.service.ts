import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuizDto } from './dtos/create-quiz.dto'; 
import { UpdateQuizDto } from './dtos/update-quiz.dto'; 

@Injectable()
export class QuizService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateQuizDto, userId?: string) {
    const { questions, ...quizData } = dto;
    
    return this.prisma.quiz.create({
      data: {
        ...quizData,
        questions: questions && Array.isArray(questions)
          ? { create: questions.map(q => ({
              text: q.questionText,
              type: q.type,
              answers: q.type === 'MCQ' ? q.answers : undefined,
              answer: q.type === 'SHORT_ANSWER' ? q.correctAnswer : undefined,
              options: q.choices && q.type === 'MCQ' 
                ? { create: q.choices.map((c: any) => ({ text: c.text })) } 
                : undefined
            })) }
          : undefined
      },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    });
  }

  async findAll() {
    return this.prisma.quiz.findMany({
      include: { 
        course: true, 
        questions: {
          include: {
            options: true
          }
        } 
      },
    });
  }

  async findOne(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: { 
        questions: {
          include: {
            options: true
          }
        } 
      },
    });

    if (!quiz) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  async update(id: string, dto: UpdateQuizDto) {
    // Remove all keys with undefined values
    const data = Object.fromEntries(
      Object.entries(dto).filter(([_, v]) => v !== undefined)
    );
    return this.prisma.quiz.update({
      where: { id },
      data,
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    });
  }

  async remove(id: string) {
    return this.prisma.quiz.delete({
      where: { id },
    });
  }

  async findByCourse(courseId: string) {
    return this.prisma.quiz.findMany({
      where: { courseId },
      include: { 
        questions: {
          include: {
            options: true
          }
        } 
      }
    });
  }

  // New methods for quiz completion tracking
  async submitQuizCompletion(quizId: string, submission: any, userId: string) {
    const quiz = await this.findOne(quizId);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // Calculate score based on answers
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;

    for (const question of quiz.questions) {
      const studentAnswer = submission.answers[question.id];
      if (studentAnswer) {
        if (question.type === 'MCQ') {
          const correct = Array.isArray(question.answers) ? question.answers : [];
          const student = Array.isArray(studentAnswer) ? studentAnswer : [studentAnswer];
          if (
            correct.length === student.length &&
            correct.every(ans => student.includes(ans)) &&
            student.every(ans => correct.includes(ans))
          ) {
            correctAnswers++;
          }
        } else {
          if (
            Array.isArray(question.answers) &&
            typeof question.answers[0] === 'string' &&
            typeof studentAnswer === 'string' &&
            studentAnswer.trim().toLowerCase() === question.answers[0].trim().toLowerCase()
          ) {
            correctAnswers++;
          }
        }
      }
    }

    const score = (correctAnswers / totalQuestions) * 100;

    // Check if attempt already exists
    const existingAttempt = await this.prisma.quizAttempt.findFirst({
      where: {
        userId,
        quizId
      }
    });

    let quizAttempt;
    if (existingAttempt) {
      // Update existing attempt
      quizAttempt = await this.prisma.quizAttempt.update({
        where: { id: existingAttempt.id },
        data: {
          score,
          attemptedAt: new Date(),
          status: 'SUBMITTED'
        }
      });
    } else {
      // Create new attempt
      quizAttempt = await this.prisma.quizAttempt.create({
        data: {
          userId,
          quizId,
          score,
          status: 'SUBMITTED'
        }
      });
    }

    return {
      message: 'Quiz completed successfully',
      score: Math.round(score),
      correctAnswers,
      totalQuestions,
      quizAttempt
    };
  }

  async getQuizProgress(quizId: string, userId: string) {
    const quizAttempt = await this.prisma.quizAttempt.findFirst({
      where: {
        userId,
        quizId
      }
    });

    if (!quizAttempt) {
      return {
        quizId,
        userId,
        status: 'not_started',
        progress: 0
      };
    }

    return {
      quizId,
      userId,
      status: quizAttempt.status === 'SUBMITTED' ? 'completed' : 'in_progress',
      progress: quizAttempt.status === 'SUBMITTED' ? 100 : 0,
      score: quizAttempt.score,
      completedAt: quizAttempt.attemptedAt
    };
  }

  async getStudentQuizProgress(courseId: string, userId: string) {
    const quizzes = await this.findByCourse(courseId);
    const progressPromises = quizzes.map(quiz => this.getQuizProgress(quiz.id, userId));
    return Promise.all(progressPromises);
  }

  async getInstructorQuizProgress(courseId: string, instructorId: string) {
    // Get all students enrolled in the course
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        courseId,
        course: {
          instructorId
        }
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

    // Get all quizzes for the course
    const quizzes = await this.findByCourse(courseId);

    // Get quiz attempts for all students
    const studentProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const quizProgress = await Promise.all(
          quizzes.map(async (quiz) => {
            const attempt = await this.prisma.quizAttempt.findFirst({
              where: {
                userId: enrollment.user.id,
                quizId: quiz.id
              }
            });

            return {
              quizId: quiz.id,
              quizTitle: quiz.title,
              status: attempt ? (attempt.status === 'SUBMITTED' ? 'completed' : 'in_progress') : 'not_started',
              score: attempt?.score || 0,
              completedAt: attempt?.attemptedAt
            };
          })
        );

        return {
          student: enrollment.user,
          quizProgress,
          totalQuizzes: quizzes.length,
          completedQuizzes: quizProgress.filter(p => p.status === 'completed').length,
          averageScore: quizProgress
            .filter(p => p.status === 'completed')
            .reduce((acc, p) => acc + p.score, 0) / 
            Math.max(quizProgress.filter(p => p.status === 'completed').length, 1)
        };
      })
    );

    return studentProgress;
  }

  async saveQuizProgress(quizId: string, progress: any, userId: string) {
    // This could be used to save partial progress
    // For now, we'll just return the current progress
    return this.getQuizProgress(quizId, userId);
  }
}

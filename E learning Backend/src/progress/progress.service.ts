import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProgressDto } from './dtos/create-progress.dto'; 
import { UpdateProgressDto } from './dtos/update-progress.dto'; 
import { CertificateService } from '../certificates/certificates.service';

@Injectable()
export class ProgressService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly certificateService: CertificateService,
  ) {}

  async create(dto: CreateProgressDto) {
    return this.prisma.progress.create({ data: dto });
  }

  async findAll() {
    return this.prisma.progress.findMany({
      include: {
        user: true,
        lesson: true,
      },
    });
  }

  async findOne(id: string) {
    const progress = await this.prisma.progress.findUnique({
      where: { id },
      include: { user: true, lesson: true },
    });
    if (!progress) throw new NotFoundException('Progress not found');
    return progress;
  }

  async update(id: string, dto: UpdateProgressDto) {
    return this.prisma.progress.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.progress.delete({ where: { id } });
  }

  async findByUser(userId: string) {
    return this.prisma.progress.findMany({
      where: { userId },
      include: { lesson: true },
    });
  }

  // New methods for student task management
  async getStudentTasks(userId: string) {
    // Get all enrollments for the student
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: {
                  orderBy: { order: 'asc' }
                }
              }
            }
          }
        }
      }
    });

    type StudentTask = {
      lesson: any;
      module: any;
      course: any;
      isAvailable: boolean;
      currentProgress: any;
      canStart: boolean;
    };
    const tasks: StudentTask[] = [];
    for (const enrollment of enrollments) {
      for (const module of enrollment.course.modules) {
        for (const lesson of module.lessons) {
          // Check if student has completed previous lessons
          const previousLessons = module.lessons.filter(l => l.order < lesson.order);
          const completedPrevious = await this.prisma.progress.findMany({
            where: {
              userId,
              lessonId: { in: previousLessons.map(l => l.id) },
              status: 'COMPLETED'
            }
          });

          const isAvailable = previousLessons.length === completedPrevious.length;
          
          // Check current progress
          const currentProgress = await this.prisma.progress.findFirst({
            where: { userId, lessonId: lesson.id }
          });

          tasks.push({
            lesson,
            module,
            course: enrollment.course,
            isAvailable,
            currentProgress,
            canStart: isAvailable && (!currentProgress || currentProgress.status !== 'COMPLETED')
          });
        }
      }
    }

    return tasks;
  }

  async startTask(userId: string, lessonId: string) {
    // Check if student can start this task
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            lessons: {
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });

    if (!lesson) throw new NotFoundException('Lesson not found');

    // Check if student is enrolled in the course
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        userId,
        courseId: lesson.module.courseId
      }
    });

    if (!enrollment) throw new BadRequestException('Not enrolled in this course');

    // Check if previous lessons are completed
    const previousLessons = lesson.module.lessons.filter(l => l.order < lesson.order);
    const completedPrevious = await this.prisma.progress.findMany({
      where: {
        userId,
        lessonId: { in: previousLessons.map(l => l.id) },
        status: 'COMPLETED'
      }
    });

    if (previousLessons.length > 0 && completedPrevious.length < previousLessons.length) {
      throw new BadRequestException('Must complete previous lessons first');
    }

    // Check if already working on another task
    const activeProgress = await this.prisma.progress.findFirst({
      where: {
        userId,
        status: 'IN_PROGRESS'
      }
    });

    if (activeProgress) {
      throw new BadRequestException('Must complete current task before starting another');
    }

    // Find existing progress
    let progress = await this.prisma.progress.findFirst({
      where: { userId, lessonId }
    });
    if (progress) {
      progress = await this.prisma.progress.update({
        where: { id: progress.id },
        data: { status: 'IN_PROGRESS' }
      });
    } else {
      progress = await this.prisma.progress.create({
        data: {
          userId,
          lessonId,
          status: 'IN_PROGRESS'
        }
      });
    }

    return progress;
  }

  async completeTask(userId: string, lessonId: string, grade?: number) {
    const progress = await this.prisma.progress.findFirst({
      where: { userId, lessonId }
    });

    if (!progress) throw new NotFoundException('No progress found for this task');

    if (progress.status === 'COMPLETED') {
      throw new BadRequestException('Task already completed');
    }

    // Update progress to completed
    const updatedProgress = await this.prisma.progress.update({
      where: { id: progress.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    });

    // Check if course is completed and generate certificate
    await this.checkAndGenerateCertificate(userId, lessonId);

    return updatedProgress;
  }

  private async checkAndGenerateCertificate(userId: string, lessonId: string) {
    // Get the course for this lesson
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              include: {
                modules: {
                  include: {
                    lessons: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!lesson) return;

    const course = lesson.module.course;
    const allLessons = course.modules.flatMap(m => m.lessons);
    
    // Check if all lessons are completed
    const completedLessons = await this.prisma.progress.findMany({
      where: {
        userId,
        lessonId: { in: allLessons.map(l => l.id) },
        status: 'COMPLETED'
      }
    });

    if (completedLessons.length === allLessons.length) {
      // Generate certificate
      await this.certificateService.create({
        userId,
        courseId: course.id,
        certificateUrl: `/certificates/${userId}-${course.id}.pdf` // You can implement actual PDF generation
      });

      // Update enrollment status
      await this.prisma.enrollment.updateMany({
        where: {
          userId,
          courseId: course.id
        },
        data: {
          status: 'COMPLETED'
        }
      });
    }
  }

  async getStudentProgress(userId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: {
                  include: {
                    Progress: {
                      where: { userId }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const progress = enrollments.map(enrollment => {
      const totalLessons = enrollment.course.modules.reduce(
        (sum, module) => sum + module.lessons.length, 0
      );
      const completedLessons = enrollment.course.modules.reduce(
        (sum, module) => sum + module.lessons.filter(
          lesson => lesson.Progress.some(p => p.status === 'COMPLETED')
        ).length, 0
      );

      return {
        course: enrollment.course,
        enrollment,
        totalLessons,
        completedLessons,
        progressPercentage: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0
      };
    });

    return progress;
  }

  // Get instructor's students progress
  async getInstructorStudentsProgress(instructorId: string) {
    // Get all courses by this instructor
    const instructorCourses = await this.prisma.course.findMany({
      where: { instructorId },
      include: {
        enrollments: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true
              }
            }
          }
        },
        modules: {
          include: {
            lessons: true
          }
        }
      }
    });

    const studentsProgress = [];

    for (const course of instructorCourses) {
      for (const enrollment of course.enrollments) {
        const totalLessons = course.modules.reduce(
          (sum, module) => sum + module.lessons.length, 0
        );

        if (totalLessons > 0) {
          const completedLessons = await this.prisma.progress.count({
            where: {
              userId: enrollment.userId,
              lessonId: {
                in: course.modules.flatMap(m => m.lessons.map(l => l.id))
              },
              status: 'COMPLETED'
            }
          });

          const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

          // Get last activity
          const lastActivity = await this.prisma.progress.findFirst({
            where: {
              userId: enrollment.userId,
              lessonId: {
                in: course.modules.flatMap(m => m.lessons.map(l => l.id))
              }
            },
            orderBy: { updatedAt: 'desc' },
            select: { updatedAt: true }
          });

          studentsProgress.push({
            studentId: enrollment.userId,
            studentName: enrollment.user.fullName,
            studentEmail: enrollment.user.email,
            courseId: course.id,
            courseTitle: course.title,
            progressPercentage,
            completedLessons,
            totalLessons,
            lastActivity: lastActivity?.updatedAt || enrollment.createdAt
          });
        }
      }
    }

    return studentsProgress;
  }
}

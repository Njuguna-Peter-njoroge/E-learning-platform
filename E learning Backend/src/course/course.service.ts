import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}


  async create(dto: CreateCourseDto, userId: string) {

    // Verify the instructor exists
    const instructor = await this.prisma.user.findUnique({
      where: { id: dto.instructorName },

    });

    if (!instructor) {

      throw new NotFoundException(`Instructor with ID ${dto.instructorName} not found`)
    }

    if (instructor.role !== 'INSTRUCTOR' && instructor.role !== 'ADMIN') {
      throw new ForbiddenException('Only instructors and admins can create courses');
    }

    // Ensure the authenticated user is the same as the instructor or is an admin

    if (userId !== instructor.id && instructor.role !== 'ADMIN') {
      throw new ForbiddenException('You can only create courses for your own account');

    }

    return this.prisma.course.create({
      data: {
        iconImage: dto.iconImage ?? undefined, // optional
        title: dto.title,
        description: dto.description,
        level: dto.level,
        category: dto.category,
        status: dto.status,
        instructorId: instructor.id,
      },
    });
  }

  // Get all courses (with instructor + modules)
  async findAll() {
    return this.prisma.course.findMany({
      include: {
        instructor: true,
        modules: true,
      },
    });
  }

  // Get course by ID
  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: true,
        modules: true,
      },
    });

    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  // Update course using instructorName (if provided)
  async update(id: string, dto: UpdateCourseDto) {
    let instructorId: string | undefined;

    if (dto.instructorName) {
      const instructor = await this.prisma.user.findFirst({
        where: {
          fullName: dto.instructorName,
          role: 'INSTRUCTOR',
        },
      });

      if (!instructor) {
        throw new NotFoundException(
          `Instructor '${dto.instructorName}' not found`,
        );
      }

      instructorId = instructor.id;
    }

    return this.prisma.course.update({
      where: { id },
      data: {
        iconImage: dto.iconImage ?? undefined,
        title: dto.title,
        description: dto.description,
        level: dto.level,
        category: dto.category,
        status: dto.status,
        instructorId: instructorId ?? undefined,
      },
    });
  }

  async remove(id: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');

    return this.prisma.course.delete({
      where: { id },
    });
  }

  // Get courses by instructor
  async findByInstructor(instructorId: string) {
    return this.prisma.course.findMany({
      where: { instructorId },
      include: {
        instructor: true,
        modules: {
          include: {
            lessons: true
          }
        },
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
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Get instructor dashboard stats
  async getInstructorDashboardStats(instructorId: string) {
    const courses = await this.prisma.course.findMany({
      where: { instructorId },
      include: {
        modules: {
          include: {
            lessons: true
          }
        },
        enrollments: {
          include: {
            user: true
          }
        }
      }
    });

    const totalCourses = courses.length;
    const activeCourses = courses.filter(c => c.status === 'PUBLISHED').length;
    const draftCourses = courses.filter(c => c.status === 'DRAFT').length;
    const totalStudents = courses.reduce((sum, course) => sum + course.enrollments.length, 0);
    const totalLessons = courses.reduce((sum, course) => 
      sum + course.modules.reduce((moduleSum, module) => 
        moduleSum + module.lessons.length, 0), 0);

    // Calculate average completion rate
    let totalProgress = 0;
    let progressCount = 0;

    for (const course of courses) {
      const totalCourseLessons = course.modules.reduce((sum, module) => 
        sum + module.lessons.length, 0);
      
      if (totalCourseLessons > 0) {
        for (const enrollment of course.enrollments) {
          // Get completed lessons for this enrollment
          const completedLessons = await this.prisma.progress.count({
            where: {
              userId: enrollment.userId,
              lessonId: {
                in: course.modules.flatMap(m => m.lessons.map(l => l.id))
              },
              status: 'COMPLETED'
            }
          });

          const progressPercentage = (completedLessons / totalCourseLessons) * 100;
          totalProgress += progressPercentage;
          progressCount++;
        }
      }
    }

    const averageCompletionRate = progressCount > 0 ? Math.round(totalProgress / progressCount) : 0;

    return {
      totalCourses,
      activeCourses,
      draftCourses,
      totalStudents,
      totalLessons,
      averageCompletionRate
    };
  }
}

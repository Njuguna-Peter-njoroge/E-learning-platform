const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixEnrollments() {
  try {
    console.log('🔧 Fixing enrollments...\n');

    // 1. Delete all enrollments where the user is not a STUDENT
    const nonStudentEnrollments = await prisma.enrollment.findMany({
      where: {
        user: {
          role: {
            not: 'STUDENT'
          }
        }
      },
      include: {
        user: true,
        course: true
      }
    });

    console.log(`🗑️  Deleting ${nonStudentEnrollments.length} non-student enrollments...`);
    for (const enrollment of nonStudentEnrollments) {
      console.log(`  - Removing ${enrollment.user.fullName} (${enrollment.user.role}) from ${enrollment.course.title}`);
      await prisma.enrollment.delete({
        where: { id: enrollment.id }
      });
    }

    // 2. Get all students and courses
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: { id: true, fullName: true, email: true }
    });

    const courses = await prisma.course.findMany({
      where: {
        instructor: {
          role: 'INSTRUCTOR'
        }
      },
      select: { id: true, title: true, instructorId: true }
    });

    console.log(`\n👥 Found ${students.length} students`);
    console.log(`📚 Found ${courses.length} courses`);

    // 3. Create some proper student enrollments
    const enrollmentsToCreate = [];
    
    // Enroll some students in courses
    for (let i = 0; i < Math.min(students.length, 5); i++) {
      const student = students[i];
      
      // Enroll each student in 1-2 courses
      const coursesToEnroll = courses.slice(i % courses.length, (i % courses.length) + 1 + (i % 2));
      
      for (const course of coursesToEnroll) {
        // Check if enrollment already exists
        const existingEnrollment = await prisma.enrollment.findFirst({
          where: {
            userId: student.id,
            courseId: course.id
          }
        });

        if (!existingEnrollment) {
          enrollmentsToCreate.push({
            userId: student.id,
            courseId: course.id,
            status: 'ENROLLED'
          });
        }
      }
    }

    console.log(`\n➕ Creating ${enrollmentsToCreate.length} new student enrollments...`);
    for (const enrollment of enrollmentsToCreate) {
      await prisma.enrollment.create({
        data: enrollment
      });
    }

    // 4. Create some progress records for testing
    console.log('\n📈 Creating progress records...');
    
    // Get lessons from courses
    const coursesWithLessons = await prisma.course.findMany({
      include: {
        modules: {
          include: {
            lessons: true
          }
        }
      }
    });

    let progressCount = 0;
    for (const course of coursesWithLessons) {
      if (course.modules.length > 0 && course.modules[0].lessons.length > 0) {
        // Get students enrolled in this course
        const enrollments = await prisma.enrollment.findMany({
          where: {
            courseId: course.id,
            user: {
              role: 'STUDENT'
            }
          },
          include: {
            user: true
          }
        });

        for (const enrollment of enrollments.slice(0, 2)) { // Limit to 2 students per course
          const lesson = course.modules[0].lessons[0]; // First lesson
          
          // Create progress record
          await prisma.progress.create({
            data: {
              userId: enrollment.userId,
              lessonId: lesson.id,
              status: 'COMPLETED'
            }
          });
          progressCount++;
          console.log(`  - ${enrollment.user.fullName} completed ${lesson.title}`);
        }
      }
    }

    console.log(`\n✅ Created ${progressCount} progress records`);

    // 5. Show final state
    const finalEnrollments = await prisma.enrollment.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            role: true
          }
        },
        course: {
          select: {
            title: true
          }
        }
      }
    });

    console.log('\n📊 Final enrollment state:');
    console.log(`Total enrollments: ${finalEnrollments.length}`);
    
    const studentEnrollments = finalEnrollments.filter(e => e.user.role === 'STUDENT');
    console.log(`Student enrollments: ${studentEnrollments.length}`);
    
    studentEnrollments.forEach(enrollment => {
      console.log(`  - ${enrollment.user.fullName} enrolled in ${enrollment.course.title}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixEnrollments(); 
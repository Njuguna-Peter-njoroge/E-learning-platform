const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('🔍 Checking database data...\n');

    // Check users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true
      }
    });
    console.log('👥 Users:', users.length);
    users.forEach(user => {
      console.log(`  - ${user.fullName} (${user.email}) - ${user.role}`);
    });

    // Check courses
    const courses = await prisma.course.findMany({
      include: {
        instructor: {
          select: {
            fullName: true,
            email: true
          }
        },
        enrollments: {
          include: {
            user: {
              select: {
                fullName: true,
                email: true
              }
            }
          }
        }
      }
    });
    console.log('\n📚 Courses:', courses.length);
    courses.forEach(course => {
      console.log(`  - ${course.title} by ${course.instructor.fullName}`);
      console.log(`    Enrollments: ${course.enrollments.length}`);
      course.enrollments.forEach(enrollment => {
        console.log(`      - ${enrollment.user.fullName} (${enrollment.user.email})`);
      });
    });

    // Check enrollments
    const enrollments = await prisma.enrollment.findMany({
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
            title: true,
            instructor: {
              select: {
                fullName: true
              }
            }
          }
        }
      }
    });
    console.log('\n🎓 Enrollments:', enrollments.length);
    enrollments.forEach(enrollment => {
      console.log(`  - ${enrollment.user.fullName} (${enrollment.user.role}) enrolled in ${enrollment.course.title}`);
    });

    // Check progress
    const progress = await prisma.progress.findMany({
      include: {
        user: {
          select: {
            fullName: true
          }
        },
        lesson: {
          select: {
            title: true
          }
        }
      }
    });
    console.log('\n📈 Progress records:', progress.length);
    progress.forEach(p => {
      console.log(`  - ${p.user.fullName} completed ${p.lesson.title}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData(); 
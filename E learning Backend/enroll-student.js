const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function enrollStudent(studentEmail, courseId) {
  try {
    // Validate required parameters
    if (!studentEmail) {
      console.log('❌ Error: Student email is required');
      console.log('Usage: node enroll-student.js <email> [courseId]');
      return;
    }
    
    const email = studentEmail;
    const courseIdToUse = courseId || '6d13ae67-625a-4aeb-a63e-58c0a95805e6'; // Web Development Fundamentals
    
    console.log(`🔧 Enrolling student: ${email}`);
    
    // Get the student
    const student = await prisma.user.findUnique({
      where: { email: email }
    });
    
    if (!student) {
      console.log(`❌ Student with email "${email}" not found`);
      return;
    }
    
    // Get the course
    const course = await prisma.course.findUnique({
      where: { id: courseIdToUse }
    });
    
    if (!course) {
      console.log(`❌ Course with ID "${courseIdToUse}" not found`);
      return;
    }
    
    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: student.id,
        courseId: courseIdToUse
      }
    });
    
    if (existingEnrollment) {
      console.log(`✅ Student is already enrolled in "${course.title}"`);
      console.log(`   Enrollment ID: ${existingEnrollment.id}`);
      console.log(`   Status: ${existingEnrollment.status}`);
      return;
    }
    
    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId: courseIdToUse,
        status: 'ENROLLED'
      },
      include: {
        user: { select: { email: true, fullName: true } },
        course: { select: { title: true } }
      }
    });
    
    console.log('✅ Student enrolled successfully!');
    console.log(`   Student: ${enrollment.user.fullName} (${enrollment.user.email})`);
    console.log(`   Course: ${enrollment.course.title}`);
    console.log(`   Enrollment ID: ${enrollment.id}`);
    console.log(`   Status: ${enrollment.status}`);
    console.log(`   Enrolled At: ${enrollment.enrolledAt}`);
    
  } catch (error) {
    console.error('❌ Error enrolling student:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Get command line arguments
const studentEmail = process.argv[2];
const courseId = process.argv[3];

console.log('Usage: node enroll-student.js <email> [courseId]');
console.log('Example: node enroll-student.js student@example.com 6d13ae67-625a-4aeb-a63e-58c0a95805e6');

enrollStudent(studentEmail, courseId); 
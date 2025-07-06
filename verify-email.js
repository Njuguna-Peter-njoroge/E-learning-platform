const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyUserEmail(email) {
  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isVerified: true,
        role: true
      }
    });

    if (!user) {
      console.log(`❌ User with email "${email}" not found`);
      return;
    }

    if (user.isVerified) {
      console.log(`✅ User "${user.firstName} ${user.lastName}" (${email}) is already verified`);
      return;
    }

    // Update the user to mark as verified
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { isVerified: true },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isVerified: true,
        role: true
      }
    });

    console.log(`✅ Successfully verified user: ${updatedUser.firstName} ${updatedUser.lastName} (${email})`);
    console.log(`   Role: ${updatedUser.role}`);
    console.log(`   Verified: ${updatedUser.isVerified}`);

  } catch (error) {
    console.error('❌ Error verifying user:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line argument or use a default
const email = process.argv[2] || 'student@example.com';

console.log(`🔍 Verifying email: ${email}`);
verifyUserEmail(email); 
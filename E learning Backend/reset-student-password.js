const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function resetStudentPassword() {
  try {
    const email = 'student@example.com';
    const newPassword = 'student123';
    
    console.log(`🔧 Resetting password for: ${email}`);
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      console.log(`❌ User with email "${email}" not found`);
      return;
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the user's password
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });
    
    console.log('✅ Password reset successfully!');
    console.log(`   Email: ${updatedUser.email}`);
    console.log(`   New Password: ${newPassword}`);
    console.log(`   Role: ${updatedUser.role}`);
    console.log(`   Verified: ${updatedUser.isVerified}`);
    console.log('\n🔑 You can now login with:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${newPassword}`);
    
  } catch (error) {
    console.error('❌ Error resetting password:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetStudentPassword(); 
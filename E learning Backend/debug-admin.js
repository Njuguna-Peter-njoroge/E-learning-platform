const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugAdminUsers() {
  try {
    console.log('🔍 Checking for admin users...\n');
    
    // Find all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isVerified: true,
        status: true,
        createdAt: true
      }
    });

    console.log(`📊 Total users found: ${users.length}\n`);
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
      console.log('💡 You need to register a user first');
      return;
    }

    // Show all users
    console.log('👥 All users:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.fullName} (${user.email})`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Verified: ${user.isVerified ? '✅ Yes' : '❌ No'}`);
      console.log(`   Status: ${user.status}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('');
    });

    // Check for admin users specifically
    const adminUsers = users.filter(user => user.role === 'ADMIN');
    console.log(`👑 Admin users found: ${adminUsers.length}`);
    
    if (adminUsers.length === 0) {
      console.log('❌ No admin users found');
      console.log('💡 You need to create an admin user');
    } else {
      console.log('✅ Admin users found:');
      adminUsers.forEach(user => {
        console.log(`   - ${user.fullName} (${user.email}) - Verified: ${user.isVerified ? 'Yes' : 'No'}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

debugAdminUsers(); 
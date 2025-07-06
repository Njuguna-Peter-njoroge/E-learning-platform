const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdminAndGetToken() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        email: 'admin@example.com'
      }
    });

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      console.log('You can login with:');
      console.log('Email: admin@example.com');
      console.log('Password: admin123');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.create({
      data: {
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
        isVerified: true, // Admin doesn't need email verification
        status: 'ACTIVE'
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: admin123');
    console.log('👤 Role:', admin.role);
    console.log('✅ Verified:', admin.isVerified);
    
    console.log('\n🚀 You can now login with these credentials:');
    console.log('POST http://localhost:3000/auth/login');
    console.log('Content-Type: application/json');
    console.log('{');
    console.log('  "email": "admin@example.com",');
    console.log('  "password": "admin123"');
    console.log('}');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminAndGetToken(); 
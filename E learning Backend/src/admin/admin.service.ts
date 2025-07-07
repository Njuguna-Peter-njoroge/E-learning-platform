import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Development helper method to create admin user
  async createAdminUser() {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';
    const adminName = 'Admin User';

    // Check if admin already exists
    const existingAdmin = await this.prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      return {
        message: 'Admin user already exists',
        user: {
          email: existingAdmin.email,
          role: existingAdmin.role,
          isVerified: existingAdmin.isVerified,
        },
        loginInfo: {
          email: adminEmail,
          password: adminPassword,
        }
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const adminUser = await this.prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        fullName: adminName,
        role: 'ADMIN',
        isVerified: true,
        status: 'ACTIVE'
      }
    });

    return {
      message: 'Admin user created successfully',
      user: {
        id: adminUser.id,
        email: adminUser.email,
        fullName: adminUser.fullName,
        role: adminUser.role,
        isVerified: adminUser.isVerified,
      },
      loginInfo: {
        email: adminEmail,
        password: adminPassword,
      }
    };
  }

  // Development helper method to debug users
  async debugUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isVerified: true,
        status: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const adminUsers = users.filter(user => user.role === 'ADMIN');
    const studentUsers = users.filter(user => user.role === 'STUDENT');
    const instructorUsers = users.filter(user => user.role === 'INSTRUCTOR');

    return {
      totalUsers: users.length,
      adminUsersCount: adminUsers.length,
      studentUsersCount: studentUsers.length,
      instructorUsersCount: instructorUsers.length,
      users: users,
      adminUsers: adminUsers,
      studentUsers: studentUsers,
      instructorUsers: instructorUsers,
    };
  }

  // Development helper method to get admin login info
  async getAdminLoginInfo() {
    const admin = await this.prisma.user.findFirst({
      where: { email: 'admin@example.com' }
    });

    if (!admin) {
      return {
        message: 'No admin user found',
        createAdmin: true,
        loginInfo: {
          email: 'admin@example.com',
          password: 'admin123',
        }
      };
    }

    return {
      message: 'Admin user found',
      user: {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
        isVerified: admin.isVerified,
      },
      loginInfo: {
        email: 'admin@example.com',
        password: 'admin123',
      }
    };
  }
}

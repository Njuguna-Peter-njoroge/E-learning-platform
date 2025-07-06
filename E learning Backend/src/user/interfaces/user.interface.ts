import { Role, AccountStatus } from '@prisma/client';

export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: Role;
  isVerified: boolean;
  status: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
  verificationToken?: string;
  profileImage?: string | null;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  role?: Role;
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  password?: string;
  role?: Role;
}

export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  isVerified: boolean;
  status: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
  profileImage?: string | null;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  data: UserResponse[];
}

export interface UserDetailResponse {
  success: boolean;
  message: string;
  data: UserResponse;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserStatusUpdateRequest {
  status: AccountStatus;
}

export interface UserSearchFilters {
  status?: AccountStatus;
  role?: Role;
  isVerified?: boolean;
  search?: string;
}

export interface UserPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserListWithPagination {
  success: boolean;
  message: string;
  data: UserResponse[];
  pagination: UserPagination;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  bannedUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  usersByRole: {
    ADMIN: number;
    INSTRUCTOR: number;
    STUDENT: number;
  };
}

export interface UserStatsResponse {
  success: boolean;
  message: string;
  data: UserStats;
} 
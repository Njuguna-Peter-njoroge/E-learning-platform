import {AccountStatus, Role} from "@prisma/client";

export interface JwtPayload {
    sub: string;
    email: string;
    role: Role;
    iat?: number;
    exp?: number;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: Role;
        Status:AccountStatus;
        profileImage: string | null;
        resetCode:string;
    };
}

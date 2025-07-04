
export class updateUserDto {
    fullName?:string;
    email?:string;
    password:string;
    role: 'STUDENT' |'INSTRUCTOR'| 'ADMIN';
}
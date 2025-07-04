export class createuserDto {
    fullName:string;
    email:string;
    password:string;
    role: 'STUDENT' |'INSTRUCTOR'| 'ADMIN';
}
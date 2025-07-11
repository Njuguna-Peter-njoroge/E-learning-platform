import { Routes } from '@angular/router';
import { HOME } from './pages/home/home';
import { Courses } from './pages/courses/courses';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard';
import { ContactComponent } from './pages/contact/contact';
import { AboutComponent } from './pages/about/about';
import { CourseDetails } from './pages/course-details/course-details';
import { LoginComponent } from './component/login/login';
import { RegisterComponent } from './component/register/register';
import { VerifyEmailComponent } from './pages/verify-email/verify-email';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password';
import { ResetPasswordComponent } from './pages/reset-password/reset-password';
import { EnrollmentComponent } from './pages/enrollment/enrollment';
import { LessonViewComponent } from './components/lesson-view';
import { AdminDashboardComponent } from './Components/admindashboard/admindashboard';
import { InstructorDashboardComponent } from './instructor-dashboard/instructor-dashboard';
import { CourseCreateComponent } from './pages/course-create/course-create';
import { QuizTakePageComponent } from './pages/quiz-take/quiz-take';
import { QuizCreatePageComponent } from './pages/quiz-create/quiz-create-page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: HOME },
  { path: 'home', component: HOME },
  { path: 'courses', component: Courses },
  { path: 'courses/create', component: CourseCreateComponent },
  { path: 'dashboard', component: StudentDashboardComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'course-details/:id', component: CourseDetails },
  { path: 'courses/:id', component: CourseDetails },
  { path: 'courses/:id/edit', component: CourseCreateComponent },
  { path: 'admindashboard', component: AdminDashboardComponent },
  { path: 'instructor-dashboard', component: InstructorDashboardComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'tlogin', component: LoginComponent },
  { path: 'tregister', component: RegisterComponent },
  { path: 'enroll-course', component: EnrollmentComponent },
  { path: 'courses/:courseId/lessons', component: LessonViewComponent },
  { path: 'courses/:courseId/quizzes', component: QuizTakePageComponent },
  { path: 'courses/:courseId/quizzes/create', component: QuizCreatePageComponent }
];

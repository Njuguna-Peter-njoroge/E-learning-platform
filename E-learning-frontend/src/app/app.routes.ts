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


export const routes: Routes = [
    {
        path: '',
        pathMatch :'full',
        component:HOME
    },
    {
        path: 'home',
        component:HOME
    },
    {
        path: 'courses',
        component:Courses
    },
    {

        path: 'dashboard',
        component:StudentDashboardComponent
    },
    {
        path: 'contact',
        component:ContactComponent
    },
    {
        path: 'about',
        component:AboutComponent
    },
    {
        path: 'login',
        component:LoginComponent
    },
  {     

        path: 'course-details/:id',
        component: CourseDetails,
      },
      // {
//         path: 'course-details/:id',
//         component: CourseDetails
//       },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'tlogin',
        component: LoginComponent
      },
      {
        path: 'tregister',
        component: RegisterComponent
      },
      {
        path: 'verify-email',
        component: VerifyEmailComponent
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent
      }
    
    
  
];

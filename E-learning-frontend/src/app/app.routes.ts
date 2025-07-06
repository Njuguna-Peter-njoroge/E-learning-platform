import { Routes } from '@angular/router';
import { HOME } from './pages/home/home';
import { Courses } from './pages/courses/courses';
import { CourseDetails } from './pages/course-details/course-details';
import { LoginComponent } from './component/login/login';
import { RegisterComponent } from './component/register/register';

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
        path: 'course-details/:id',
        component: CourseDetails,
      },
      {
        path: 'course-details/:id',
        component: CourseDetails
      },
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
      }
    
      
      


];

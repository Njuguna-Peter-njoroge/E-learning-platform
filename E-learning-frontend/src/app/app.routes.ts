import { Routes } from '@angular/router';
import { HOME } from './pages/home/home';
import { Courses } from './pages/courses/courses';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard';
import { ContactComponent } from './pages/contact/contact';
import { AboutComponent } from './pages/about/about';
import { LoginComponent } from './pages/login/login';

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
    }
];

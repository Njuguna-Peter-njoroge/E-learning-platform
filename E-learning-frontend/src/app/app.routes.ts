import { Routes } from '@angular/router';
import { HOME } from './pages/home/home';
import { Courses } from './pages/courses/courses';

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


];

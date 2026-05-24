import {Routes} from '@angular/router';
import {authGuard} from './guards/auth-guard';
import {guestGuard} from './guards/guest-guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    },
    {
        title: 'Galleria Bank | Login',
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import('./pages/login/login').then((c) => c.Login)
    },
    {
        title: 'Galleria Bank | Create User',
        path: 'create-user',
        canActivate: [guestGuard],
        loadComponent: () => import('./pages/create-user/create-user').then((c) => c.CreateUser)
    },
    {
        path: '',
        loadComponent: () => import('./pages/private-layout/private-layout').then((m) => m.PrivateLayout),
        canActivateChild: [authGuard],
        children: [
            {
                title: 'Galleria Bank | Dashboard',
                path: 'dashboard',
                loadComponent: () => import('./pages/private-layout/dashboard/dashboard').then((m) => m.Dashboard)
            }
        ]
    }
];

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
        canActivate: [authGuard],
        canActivateChild: [authGuard],
        children: [
            {
                title: 'Galleria Bank | Dashboard',
                path: 'dashboard',
                loadComponent: () => import('./pages/private-layout/dashboard/dashboard').then((m) => m.Dashboard)
            },
            {
                title: 'Galleria Bank | Clients',
                path: 'client',
                loadComponent: () => import('./pages/private-layout/clients/list/clients').then((m) => m.Clients)
            },
            {
                title: 'Galleria Bank | New Client',
                path: 'client/new',
                loadComponent: () => import('./pages/private-layout/clients/new/client-new').then((m) => m.ClientNew)
            },
            {
                title: 'Galleria Bank | Update Client',
                path: 'client/update/:id',
                loadComponent: () => import('./pages/private-layout/clients/update/client-update').then((m) => m.ClientUpdate)
            },
            {
                title: 'Galleria Bank | Client',
                path: 'client/:id',
                loadComponent: () => import('./pages/private-layout/clients/detail/client-detail').then((m) => m.ClientDetail)
            },
            {
                title: 'Galleria Bank | Products',
                path: 'product',
                loadComponent: () => import('./pages/private-layout/products/list/products').then((m) => m.Products)
            },
            {
                title: 'Galleria Bank | New Product',
                path: 'product/new',
                loadComponent: () => import('./pages/private-layout/products/new/product-new').then((m) => m.ProductNew)
            },
            {
                title: 'Galleria Bank | Update Product',
                path: 'product/update/:id',
                loadComponent: () => import('./pages/private-layout/products/update/product-update').then((m) => m.ProductUpdate)
            },
            {
                title: 'Galleria Bank | Product',
                path: 'product/:id',
                loadComponent: () => import('./pages/private-layout/products/detail/product-detail').then((m) => m.ProductDetail)
            },
            {
                title: 'Galleria Bank | Orders',
                path: 'order',
                loadComponent: () => import('./pages/private-layout/orders/list/orders').then((m) => m.Orders)
            },
            {
                title: 'Galleria Bank | New Order',
                path: 'order/new',
                loadComponent: () => import('./pages/private-layout/orders/new/order-new').then((m) => m.OrderNew)
            },
            {
                title: 'Galleria Bank | Order',
                path: 'order/:id',
                loadComponent: () => import('./pages/private-layout/orders/detail/order-detail').then((m) => m.OrderDetail)
            },
            {
                title: 'Galleria Bank | User Settings',
                path: 'user-settings',
                loadComponent: () => import('./pages/private-layout/user-settings/user-settings').then((m) => m.UserSettings)
            }
        ]
    }
];

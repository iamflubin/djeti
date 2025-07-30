import { Routes } from '@angular/router';
import { LayoutComponent } from './core/components/layout/layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: '',
        component: LayoutComponent,
        children: [
          {
            path: 'dashboard',
            loadChildren: () =>
              import('./dashboard/dashboard.routes').then(
                m => m.DASHBOARD_ROUTES
              ),
          },
          {
            path: 'transactions',
            loadChildren: () =>
              import('./transactions/transactions.routes').then(
                m => m.TRANSACTIONS_ROUTES
              ),
          },
        ],
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
      },
    ],
  },
];

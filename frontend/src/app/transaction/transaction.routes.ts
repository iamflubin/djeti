import { Routes } from '@angular/router';
import { ExpensesPageComponent } from './pages/expenses-page/expenses-page.component';
import { IncomesPageComponent } from './pages/incomes-page/incomes-page.component';
import { TransactionComponent } from './transaction.component';

export const TRANSACTION_ROUTES: Routes = [
  {
    path: '',
    component: TransactionComponent,
    children: [
      {
        path: '',
        redirectTo: 'incomes',
        pathMatch: 'full',
      },
      {
        path: 'incomes',
        component: IncomesPageComponent,
      },
      {
        path: 'expenses',
        component: ExpensesPageComponent,
      },
    ],
  },
];

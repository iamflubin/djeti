import { Routes } from '@angular/router';
import { ExpensesPageComponent } from './pages/expenses-page/expenses-page.component';
import { IncomesPageComponent } from './pages/incomes-page/incomes-page.component';
import { TransactionsComponent } from './transactions.component';

export const TRANSACTIONS_ROUTES: Routes = [
  {
    path: '',
    component: TransactionsComponent,
    children: [
      {
        path: '',
        redirectTo: 'incomes',
        pathMatch: 'full',
      },
      {
        path: 'incomes',
        title: 'Incomes',
        component: IncomesPageComponent,
      },
      {
        path: 'expenses',
        title: 'Expenses',
        component: ExpensesPageComponent,
      },
    ],
  },
];

import { Component } from '@angular/core';
import { TransactionListComponent } from '../../components/transaction-list/transaction-list.component';

@Component({
  selector: 'app-incomes-page',
  imports: [TransactionListComponent],
  templateUrl: './incomes-page.component.html',
  styleUrl: './incomes-page.component.scss',
})
export class IncomesPageComponent {}

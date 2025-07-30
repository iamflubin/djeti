import { Component } from '@angular/core';
import { TransactionTableComponent } from '../../components/transaction-table/transaction-table.component';

@Component({
  selector: 'app-incomes-page',
  imports: [TransactionTableComponent],
  templateUrl: './incomes-page.component.html',
  styleUrl: './incomes-page.component.scss',
})
export class IncomesPageComponent {}

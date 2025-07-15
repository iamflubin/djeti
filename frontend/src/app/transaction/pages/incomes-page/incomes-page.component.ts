import { Component } from '@angular/core';
import { TransactionListContainerComponent } from '../../components/transaction-list-container/transaction-list-container.component';

@Component({
  selector: 'app-incomes-page',
  imports: [TransactionListContainerComponent],
  templateUrl: './incomes-page.component.html',
  styleUrl: './incomes-page.component.scss',
})
export class IncomesPageComponent {}

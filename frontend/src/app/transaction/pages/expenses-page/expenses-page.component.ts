import { Component } from '@angular/core';
import { TransactionListContainerComponent } from '../../components/transaction-list-container/transaction-list-container.component';

@Component({
  selector: 'app-expenses-page',
  imports: [TransactionListContainerComponent],
  templateUrl: './expenses-page.component.html',
  styleUrl: './expenses-page.component.scss',
})
export class ExpensesPageComponent {}

import { Component } from '@angular/core';
import { TransactionTableComponent } from '../../components/transaction-table/transaction-table.component';

@Component({
  selector: 'app-expenses-page',
  imports: [TransactionTableComponent],
  templateUrl: './expenses-page.component.html',
  styleUrl: './expenses-page.component.scss'
})
export class ExpensesPageComponent {

}

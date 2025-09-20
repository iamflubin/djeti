import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TransactionTableComponent } from '../../components/transaction-table/transaction-table.component';

@Component({
  selector: 'app-expenses-page',
  imports: [TransactionTableComponent],
  template: `
    <h1 class="text-3xl font-black">Expenses</h1>
    <p class="mb-4 text-sm text-muted-foreground">
      View and manage your expenses
    </p>

    <app-transaction-table type="EXPENSE" />
  `,
  styleUrl: './expenses-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesPageComponent {}

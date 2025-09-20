import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TransactionTableComponent } from '../../components/transaction-table/transaction-table.component';

@Component({
  selector: 'app-incomes-page',
  imports: [TransactionTableComponent],
  template: `
    <h1 class="text-3xl font-black">Incomes</h1>
    <p class="mb-4 text-sm text-muted-foreground">
      View and manage your incomes
    </p>

    <app-transaction-table type="INCOME" />
  `,
  styleUrl: './incomes-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomesPageComponent {}

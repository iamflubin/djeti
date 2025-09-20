import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Summary } from '../../models';
import { SummaryCardComponent } from '../summary-card/summary-card.component';

@Component({
  selector: 'app-summary',
  imports: [SummaryCardComponent],
  template: `
    <div class="grid gap-4 md:grid-cols-3">
      <app-summary-card
        title="Total Income"
        [amount]="summary().totalIncome"
        icon="💰" />
      <app-summary-card
        title="Total Expenses"
        [amount]="summary().totalExpenses"
        icon="💸" />
      <app-summary-card
        title="Balance"
        [amount]="summary().balance"
        icon="💰" />
    </div>
  `,
  styleUrl: './summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent {
  readonly summary = input.required<Summary>();
}

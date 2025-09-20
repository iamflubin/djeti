import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  HlmCardContentDirective,
  HlmCardDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/helm/card';
import { formatMoney } from '../../../core/utils';
import { Budget } from '../../models';
import { BudgetProgressComponent } from '../budget-progress/budget-progress.component';
@Component({
  selector: 'app-budget',
  imports: [
    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmCardContentDirective,
    BudgetProgressComponent,
  ],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetComponent {
  readonly budget = input.required<Budget>();

  formatMoney(amount: number): string {
    return formatMoney(amount);
  }
}

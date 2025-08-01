import { Component, computed, input } from '@angular/core';

import {
  BrnProgressComponent,
  BrnProgressIndicatorComponent,
} from '@spartan-ng/brain/progress';
import {
  HlmProgressDirective,
  HlmProgressIndicatorDirective,
} from '@spartan-ng/helm/progress';

@Component({
  selector: 'app-budget-progress',
  imports: [
    HlmProgressDirective,
    HlmProgressIndicatorDirective,
    BrnProgressComponent,
    BrnProgressIndicatorComponent,
  ],
  templateUrl: './budget-progress.component.html',
  styleUrl: './budget-progress.component.scss',
})
export class BudgetProgressComponent {
  readonly goal = input.required<number>();
  readonly spent = input.required<number>();

  protected readonly value = computed(() => {
    const goal = this.goal();
    const spent = this.spent();

    if (goal <= 0) return 0;

    const percentage = (spent / goal) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  });
}

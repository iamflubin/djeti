import { Component, computed, input } from '@angular/core';
import {
  HlmCardContentDirective,
  HlmCardDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/helm/card';
import { formatMoney } from '../../../core/utils';
@Component({
  selector: 'app-summary-card',
  imports: [
    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmCardContentDirective,
  ],
  templateUrl: './summary-card.component.html',
  styleUrl: './summary-card.component.scss',
})
export class SummaryCardComponent {
  readonly title = input.required<string>();
  readonly amount = input.required<number>();
  readonly icon = input.required<string>();

  protected readonly formattedAmount = computed(() => {
    return formatMoney(this.amount());
  });
}

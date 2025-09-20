import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
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
  template: `
    <div hlmCard>
      <div hlmCardHeader>
        <h3 hlmCardTitle>
          {{ icon() }}
          {{ title() }}
        </h3>
      </div>
      <p hlmCardContent class="text-2xl font-bold">
        {{ formattedAmount() }}
      </p>
    </div>
  `,
  styleUrl: './summary-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryCardComponent {
  readonly title = input.required<string>();
  readonly amount = input.required<number>();
  readonly icon = input.required<string>();

  protected readonly formattedAmount = computed(() => {
    return formatMoney(this.amount());
  });
}

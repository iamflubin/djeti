import { Component, input } from '@angular/core';
import { Summary } from '../../models';
import { SummaryCardComponent } from '../summary-card/summary-card.component';

@Component({
  selector: 'app-summary',
  imports: [SummaryCardComponent],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent {
  readonly summary = input.required<Summary>();
}

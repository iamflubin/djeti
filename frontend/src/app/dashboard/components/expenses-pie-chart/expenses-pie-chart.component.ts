import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { formatMoney } from '../../../core/utils';
import { ExpensesDistribution } from '../../models';
@Component({
  selector: 'app-expenses-pie-chart',
  imports: [BaseChartDirective],
  template: `
    <div style="position: relative; height: 300px">
      <canvas
        baseChart
        [data]="pieChartData()"
        [labels]="pieChartLabels"
        [type]="pieChartType"
        [options]="pieChartOptions"
        [legend]="pieChartLegend">
      </canvas>
    </div>
  `,
  styleUrl: './expenses-pie-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesPieChartComponent {
  readonly distribution = input.required<ExpensesDistribution>();

  protected readonly pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#333',
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw as number;
            return `${context.label}: ${formatMoney(value)}`;
          },
        },
      },
    },
  };

  protected readonly pieChartLabels = ['Needs', 'Wants', 'Savings'];

  protected readonly pieChartType = 'pie';

  protected readonly pieChartLegend = true;

  protected readonly pieChartData = computed<
    ChartData<'pie', number[], string>
  >(() => {
    return {
      labels: this.pieChartLabels,
      datasets: [
        {
          data: [
            this.distribution().needs,
            this.distribution().wants,
            this.distribution().savings,
          ],
          backgroundColor: ['#10B981', '#F59E0B', '#06B6D4'],
          hoverOffset: 10,
        },
      ],
    };
  });
}

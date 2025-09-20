import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../auth/services/auth.service';
import { DateRangePickerComponent } from '../shared/components/date-range-picker/date-range-picker.component';
import { BudgetComponent } from './components/budget/budget.component';
import { ExpensesPieChartComponent } from './components/expenses-pie-chart/expenses-pie-chart.component';
import { SummaryComponent } from './components/summary/summary.component';
import { Budget, ExpensesDistribution, Summary } from './models';
import { DashboardService } from './services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    SummaryComponent,
    BudgetComponent,
    ExpensesPieChartComponent,
    DateRangePickerComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  protected readonly user = inject(AuthService).user;

  private readonly dashboardService = inject(DashboardService);

  protected readonly loading = this.dashboardService.loading;

  protected readonly dashboard = signal<{
    summary: Summary;
    budget: Budget;
    expensesDistribution: ExpensesDistribution;
  } | null>(null);

  private readonly destroyRef = inject(DestroyRef);

  onRangeChange(range: { from: Date; to: Date }) {
    this.dashboardService
      .getDashboard(range)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(dashboard => this.dashboard.set(dashboard));
  }
}

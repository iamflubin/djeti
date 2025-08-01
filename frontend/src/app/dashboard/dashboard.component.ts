import { Component, inject, OnDestroy, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
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
})
export class DashboardComponent implements OnDestroy {
  protected readonly user = inject(AuthService).user;
  private readonly destroy$ = new Subject<void>();

  private readonly dashboardService = inject(DashboardService);

  protected readonly loading = this.dashboardService.loading;

  protected dashboard = signal<{
    summary: Summary;
    budget: Budget;
    expensesDistribution: ExpensesDistribution;
  } | null>(null);

  protected readonly summary = signal<Summary>({
    totalIncome: 12035.86,
    totalExpenses: 2092.9,
    balance: 9942.96,
  });

  protected readonly budget = signal({
    needs: {
      goal: 6017.93, // 50% of 12035.86
      spent: 3046.45,
      remaining: 2971.48,
    },
    wants: {
      goal: 3610.76, // 30%
      spent: 627.87,
      remaining: 2982.89,
    },
    savings: {
      goal: 2407.17, // 20%
      spent: 418.58,
      remaining: 1988.59,
    },
  });

  protected readonly expensesDistribution = signal({
    needs: 3046.45,
    wants: 627.87,
    savings: 418.58,
  });

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onRangeChange(range: { from: Date; to: Date }) {
    this.dashboardService
      .getDashboard(range)
      .pipe(takeUntil(this.destroy$))
      .subscribe(dashboard => this.dashboard.set(dashboard));
  }
}

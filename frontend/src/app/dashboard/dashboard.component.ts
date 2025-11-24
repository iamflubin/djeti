import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { AuthService } from '../auth/services/auth.service';
import { DATE_FORMAT } from '../core/constants/date.constants';
import {
  BUDGET_RULE_STORAGE_KEY,
  DATE_RANGE_STORAGE_KEY,
} from '../core/constants/storage.constants';
import { loadFromStorage, saveToStorage } from '../core/utils';
import { DateRangePickerComponent } from '../shared/components/date-range-picker/date-range-picker.component';
import { DateRange } from '../shared/models';
import { BudgetRuleSelectorComponent } from './components/budget-rule-selector/budget-rule-selector.component';
import { BudgetComponent } from './components/budget/budget.component';
import { ExpensesPieChartComponent } from './components/expenses-pie-chart/expenses-pie-chart.component';
import { SummaryComponent } from './components/summary/summary.component';
import { Budget, BudgetRule, ExpensesDistribution, Summary } from './models';
import { DashboardService } from './services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    SummaryComponent,
    BudgetComponent,
    ExpensesPieChartComponent,
    DateRangePickerComponent,
    BudgetRuleSelectorComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  protected readonly user = inject(AuthService).user;

  private readonly dashboardService = inject(DashboardService);

  protected readonly loading = this.dashboardService.loading;

  protected readonly dashboard = signal<{
    summary: Summary;
    budget: Budget;
    expensesDistribution: ExpensesDistribution;
  } | null>(null);

  private readonly destroyRef = inject(DestroyRef);

  protected readonly initialRange;

  protected readonly initialRule;

  constructor() {
    const persistedRange = loadFromStorage<DateRange>(DATE_RANGE_STORAGE_KEY);
    const now = new Date();
    const initialFrom = persistedRange
      ? persistedRange.from
      : format(startOfMonth(now), DATE_FORMAT);
    const initialTo = persistedRange
      ? persistedRange.to
      : format(endOfMonth(now), DATE_FORMAT);

    this.initialRange = signal({ from: initialFrom, to: initialTo });

    const persistedRule = loadFromStorage<BudgetRule>(BUDGET_RULE_STORAGE_KEY);

    this.initialRule = signal(
      persistedRule || { needs: 50, wants: 30, savings: 20 }
    );
  }

  ngOnInit(): void {
    this.persitRange(this.initialRange());
    this.persistRule(this.initialRule());
    this.refreshDahboard();
  }

  refreshDahboard() {
    const range = loadFromStorage<DateRange>(DATE_RANGE_STORAGE_KEY);
    const rule = loadFromStorage<BudgetRule>(BUDGET_RULE_STORAGE_KEY);

    if (!range || !rule) {
      throw new Error('Date range or budget rule is not set');
    }

    this.dashboardService
      .getDashboard(range, rule)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(dashboard => this.dashboard.set(dashboard));
  }

  persitRange(range: DateRange) {
    saveToStorage(DATE_RANGE_STORAGE_KEY, range);
  }

  persistRule(rule: BudgetRule) {
    saveToStorage(BUDGET_RULE_STORAGE_KEY, rule);
  }
}

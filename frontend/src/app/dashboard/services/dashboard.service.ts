import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { format } from 'date-fns';
import { finalize, forkJoin, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Budget, BudgetRule, ExpensesDistribution, Summary } from '../models';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly baseUrl = `${environment.apiBaseUrl}/v1/dashboard`;
  private readonly http = inject(HttpClient);
  private readonly _loading = signal<boolean>(false);

  readonly loading = this._loading.asReadonly();

  getDashboard(
    range: { from: Date; to: Date },
    rule: BudgetRule
  ): Observable<{
    summary: Summary;
    budget: Budget;
    expensesDistribution: ExpensesDistribution;
  }> {
    this._loading.set(true);
    return forkJoin({
      summary: this.getSummary(range),
      budget: this.getBudget(range, rule),
      expensesDistribution: this.getExpensesDistribution(range),
    }).pipe(
      finalize(() => {
        this._loading.set(false);
      })
    );
  }

  private getSummary(range: { from: Date; to: Date }): Observable<Summary> {
    return this.http.get<Summary>(`${this.baseUrl}/summary`, {
      params: this.buildDateRangeParams(range),
    });
  }

  private getBudget(
    range: { from: Date; to: Date },
    rule: BudgetRule
  ): Observable<Budget> {
    return this.http.get<Budget>(`${this.baseUrl}/budget`, {
      params: {
        ...rule,
        ...this.buildDateRangeParams(range),
      },
    });
  }

  private getExpensesDistribution(range: {
    from: Date;
    to: Date;
  }): Observable<ExpensesDistribution> {
    return this.http.get<ExpensesDistribution>(
      `${this.baseUrl}/expenses-distribution`,
      {
        params: this.buildDateRangeParams(range),
      }
    );
  }

  private buildDateRangeParams(range: { from: Date; to: Date }) {
    return {
      from: format(range.from, 'yyyy-MM-dd'),
      to: format(range.to, 'yyyy-MM-dd'),
    };
  }
}

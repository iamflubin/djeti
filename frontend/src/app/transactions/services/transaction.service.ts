import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { finalize, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  PaginatedResponse,
  QueryParams,
  TransactionResponse,
  UpdateTransactionRequest,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly baseUrl = `${environment.apiBaseUrl}/v1/transactions`;
  private readonly http = inject(HttpClient);
  private readonly _transactions = signal<TransactionResponse[]>([]);
  private readonly _totalPages = signal<number>(0);
  private readonly _totalElements = signal<number>(0);
  private readonly _loading = signal<boolean>(false);
  private readonly params = signal<QueryParams>({
    page: 0,
    size: 10,
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
    type: 'INCOME',
  });
  private readonly queryParams = computed(() => ({
    page: this.params().page,
    size: this.params().size,
    from: format(this.params().from, 'yyyy-MM-dd'),
    to: format(this.params().to, 'yyyy-MM-dd'),
    type: this.params().type,
  }));
  readonly transactions = this._transactions.asReadonly();
  readonly totalPages = this._totalPages.asReadonly();
  readonly totalElements = this._totalElements.asReadonly();
  readonly loading = this._loading.asReadonly();

  setParams(params: QueryParams) {
    this.params.set(params);
  }

  saveTransaction(request: UpdateTransactionRequest): Observable<void> {
    this._loading.set(true);
    return this.http.post<void>(`${this.baseUrl}`, request).pipe(
      tap(() => this.getTransactions().subscribe()),
      finalize(() => this._loading.set(false))
    );
  }

  getTransactions(): Observable<PaginatedResponse<TransactionResponse>> {
    this._loading.set(true);
    return this.http
      .get<PaginatedResponse<TransactionResponse>>(`${this.baseUrl}`, {
        params: this.queryParams(),
      })
      .pipe(
        tap(({ content, totalPages, totalElements }) => {
          this._transactions.set(content);
          this._totalPages.set(totalPages);
          this._totalElements.set(totalElements);
        }),
        finalize(() => this._loading.set(false))
      );
  }

  updateTransaction(
    id: string,
    request: UpdateTransactionRequest
  ): Observable<void> {
    this._loading.set(true);
    return this.http.put<void>(`${this.baseUrl}/${id}`, request).pipe(
      tap(() => this.getTransactions().subscribe()),
      finalize(() => this._loading.set(false))
    );
  }

  deleteTransaction(id: string): Observable<void> {
    this._loading.set(true);
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.getTransactions().subscribe()),
      finalize(() => this._loading.set(false))
    );
  }
}

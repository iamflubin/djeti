import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { format } from 'date-fns';
import { finalize, forkJoin, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateTransactionRequest,
  PaginatedResponse,
  TransactionQueryParams,
  TransactionResponse,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly baseUrl = `${environment.apiBaseUrl}/v1/transactions`;
  private readonly http = inject(HttpClient);
  private readonly _loading = signal<boolean>(false);
  readonly loading = this._loading.asReadonly();

  getTransactions(
    queryParams: TransactionQueryParams
  ): Observable<PaginatedResponse<TransactionResponse>> {
    this._loading.set(true);
    const params = this.toHttpParams(queryParams);
    return this.http
      .get<PaginatedResponse<TransactionResponse>>(this.baseUrl, { params })
      .pipe(finalize(() => this._loading.set(false)));
  }

  createTransaction(request: CreateTransactionRequest): Observable<void> {
    this._loading.set(true);
    return this.http
      .post<void>(this.baseUrl, request)
      .pipe(finalize(() => this._loading.set(false)));
  }

  updateTransaction(
    transactionId: string,
    request: CreateTransactionRequest
  ): Observable<void> {
    this._loading.set(true);
    return this.http
      .put<void>(`${this.baseUrl}/${transactionId}`, request)
      .pipe(finalize(() => this._loading.set(false)));
  }

  deleteTransactions(ids: string[]): Observable<void[]> {
    this._loading.set(true);
    const requests = ids.map(id =>
      this.http.delete<void>(`${this.baseUrl}/${id}`)
    );
    return forkJoin(requests).pipe(finalize(() => this._loading.set(false)));
  }

  private toHttpParams(params: TransactionQueryParams): HttpParams {
    return new HttpParams()
      .append('page', params.page)
      .append('size', params.size)
      .append('from', format(params.from, 'yyyy-MM-dd'))
      .append('to', format(params.to, 'yyyy-MM-dd'))
      .append('type', params.type);
  }
}

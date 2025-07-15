import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateTransactionRequest } from '../models';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly baseUrl = `${environment.apiBaseUrl}/v1/transactions`;
  private readonly http = inject(HttpClient);
  private readonly _loading = signal<boolean>(false);
  readonly loading = this._loading.asReadonly();

  createTransaction(request: CreateTransactionRequest): Observable<void> {
    this._loading.set(true);
    return this.http
      .post<void>(this.baseUrl, request)
      .pipe(finalize(() => this._loading.set(false)));
  }
}

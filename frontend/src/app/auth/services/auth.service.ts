import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  login(payload: {
    email: string;
    password: string;
  }): Observable<LoginResponse> {
    this._loading.set(true);
    return this.http
      .post<LoginResponse>(`${environment.baseApiUrl}/v1/auth/login`, payload)
      .pipe(finalize(() => this._loading.set(false)));
  }

  register(payload: {
    fullName: string;
    email: string;
    password: string;
  }): Observable<void> {
    this._loading.set(true);
    return this.http
      .post<void>(`${environment.baseApiUrl}/v1/auth/register`, payload)
      .pipe(finalize(() => this._loading.set(false)));
  }
}

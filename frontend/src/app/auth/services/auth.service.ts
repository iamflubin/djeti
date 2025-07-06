import { HttpClient, HttpContext } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { finalize, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SKIP_AUTH } from '../../core/interceptor/auth.interceptor';
import { LoginResponse, User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  private readonly _accesToken = signal<string | null>(null);
  readonly accessToken = this._accesToken.asReadonly();

  private readonly _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();

  readonly isLoggedIn = computed(() => !!this.accessToken() && !!this.user());

  login(payload: {
    email: string;
    password: string;
  }): Observable<LoginResponse> {
    this._loading.set(true);
    return this.http
      .post<LoginResponse>(`${environment.baseApiUrl}/v1/auth/login`, payload, {
        context: new HttpContext().set(SKIP_AUTH, true),
      })
      .pipe(
        tap(response => this.setUser(response.accessToken)),
        finalize(() => this._loading.set(false))
      );
  }

  register(payload: {
    fullName: string;
    email: string;
    password: string;
  }): Observable<void> {
    this._loading.set(true);
    return this.http
      .post<void>(`${environment.baseApiUrl}/v1/auth/register`, payload, {
        context: new HttpContext().set(SKIP_AUTH, true),
      })
      .pipe(finalize(() => this._loading.set(false)));
  }

  refreshToken() {
    return this.http
      .post<LoginResponse>(
        `${environment.baseApiUrl}/v1/auth/refresh`,
        {},
        {
          context: new HttpContext().set(SKIP_AUTH, true),
          withCredentials: true,
        }
      )
      .pipe(tap(response => this.setUser(response.accessToken)));
  }

  logout() {
    this.setUser('');
    return this.http.post<void>(
      `${environment.baseApiUrl}/v1/auth/logout`,
      {},
      {
        context: new HttpContext().set(SKIP_AUTH, true),
        withCredentials: true,
      }
    );
  }

  private setUser(accessToken: string): void {
    if (!accessToken) {
      this._user.set(null);
      return;
    }
    const decodedPayload = jwtDecode<User>(accessToken);
    this._user.set(decodedPayload);
    this._accesToken.set(accessToken);
  }
}

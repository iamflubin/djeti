import {
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  finalize,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

const addToken = (
  req: HttpRequest<unknown>,
  token: string
): HttpRequest<unknown> => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const handle401 = (
  req: HttpRequest<unknown>,
  next: HttpHandler,
  auth: AuthService
): Observable<HttpEvent<unknown>> => {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return auth.refreshToken().pipe(
      switchMap(() => {
        const newToken = auth.accessToken();
        refreshTokenSubject.next(newToken);
        return next.handle(addToken(req, newToken!));
      }),
      catchError(err => {
        auth.logout().subscribe();
        return throwError(() => err);
      }),
      finalize(() => {
        isRefreshing = false;
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next.handle(addToken(req, token!)))
    );
  }
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const handler: HttpHandler = { handle: next };
  if (req.context.get(SKIP_AUTH)) return next(req);

  const token = auth.accessToken();
  const authReq = token ? addToken(req, token) : req.clone();

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return handle401(req, handler, auth);
      }
      return throwError(() => error);
    })
  );
};

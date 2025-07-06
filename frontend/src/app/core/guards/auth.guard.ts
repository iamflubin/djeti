import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn();

  if (isLoggedIn && state.url.startsWith('/auth')) {
    return router.navigate(['/']);
  }

  if (!isLoggedIn && !state.url.startsWith('/auth')) {
    return router.navigate(['auth', 'login'], {
      queryParams: {
        returnUrl: encodeURIComponent(state.url),
      },
    });
  }

  return true;
};

import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideIcons } from '@ng-icons/core';
import { lucideArrowUpDown, lucideEllipsis } from '@ng-icons/lucide';
import { catchError, firstValueFrom, of } from 'rxjs';
import { routes } from './app.routes';
import { AuthService } from './auth/services/auth.service';
import { authInterceptor } from './core/interceptor/auth.interceptor';

const refreshUser = (authService: AuthService) => {
  return firstValueFrom(
    authService.refreshToken().pipe(catchError(() => of(null)))
  );
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAppInitializer(() => refreshUser(inject(AuthService))),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideIcons({
      lucideArrowUpDown,
      lucideEllipsis,
    }),
  ],
};

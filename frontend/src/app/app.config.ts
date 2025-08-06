import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { provideIcons } from '@ng-icons/core';
import {
  lucideArrowUpDown,
  lucideEllipsis,
  lucideMenu,
} from '@ng-icons/lucide';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { catchError, firstValueFrom, of } from 'rxjs';
import { routes } from './app.routes';
import { AuthService } from './auth/services/auth.service';
import { authInterceptor } from './core/interceptor/auth.interceptor';
import { CustomTitleStrategy } from './core/title.strategy';

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
      lucideMenu,
    }),
    provideCharts(withDefaultRegisterables()),
    { provide: TitleStrategy, useClass: CustomTitleStrategy },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};

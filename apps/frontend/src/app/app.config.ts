import { ApplicationConfig, provideBrowserGlobalErrorListeners, LOCALE_ID } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { sessionInterceptor } from './shared/guards/session.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([sessionInterceptor])),
    provideRouter(routes, withComponentInputBinding()),
    provideBrowserGlobalErrorListeners(),
    { provide: LOCALE_ID, useValue: 'de-DE' }
  ],
};

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';

// 2. Importing the Interceptor (Go down into core -> interceptors)
import { apiInterceptor } from './core/interceptors/api-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([apiInterceptor])
    )
  ]
};
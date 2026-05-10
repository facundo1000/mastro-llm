import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideIcons } from '@ng-icons/core';
import {
  lucideFileText,
  lucideFile,
  lucideUpload,
  lucideTrash2,
  lucideMessageSquare,
  lucideSend,
  lucideSettings,
  lucideMenu,
  lucideX,
  lucideCheck,
  lucideCircleAlert,
  lucideLoaderCircle,
  lucidePlus,
  lucideKey,
  lucideArrowLeft,
  lucideRefreshCw,
  lucideMoon,
  lucideSun,
  lucideBot,
  lucideUser,
} from '@ng-icons/lucide';

import { routes } from './app.routes';
import { authInterceptor } from './core/api/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    provideIcons({
      lucideFileText,
      lucideFile,
      lucideUpload,
      lucideTrash2,
      lucideMessageSquare,
      lucideSend,
      lucideSettings,
      lucideMenu,
      lucideX,
      lucideCheck,
      lucideCircleAlert,
      lucideLoaderCircle,
      lucidePlus,
      lucideKey,
      lucideArrowLeft,
      lucideRefreshCw,
      lucideMoon,
      lucideSun,
      lucideBot,
      lucideUser,
    }),
  ],
};

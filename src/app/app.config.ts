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
import { authInterceptor } from '@/infrastructure/api/auth.interceptor';
import { APP_ENV } from '@/domain/tokens/app-env.token';
import { environment } from '../environments/environment';
import { ChatRepository } from '@/domain/ports/chat.repository';
import { PdfRepository } from '@/domain/ports/pdf.repository';
import { NotebookStoragePort } from '@/domain/ports/notebook-storage.port';
import { SettingsStoragePort } from '@/domain/ports/settings-storage.port';
import { HttpChatRepository } from '@/infrastructure/api/http-chat.repository';
import { HttpPdfRepository } from '@/infrastructure/api/http-pdf.repository';
import { LocalNotebookStorage } from '@/infrastructure/storage/local-notebook.storage';
import { LocalSettingsStorage } from '@/infrastructure/storage/local-settings.storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    { provide: APP_ENV, useValue: environment },
    { provide: ChatRepository, useClass: HttpChatRepository },
    { provide: PdfRepository, useClass: HttpPdfRepository },
    { provide: NotebookStoragePort, useClass: LocalNotebookStorage },
    { provide: SettingsStoragePort, useClass: LocalSettingsStorage },
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

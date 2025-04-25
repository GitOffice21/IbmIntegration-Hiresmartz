import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule } from '@angular/common/http'; // <-- Import this
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(PdfViewerModule),
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(HttpClientModule) // <-- Add this line
  ]
};

import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage-angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { StorageService } from './app/services/storage.service';

// Función para inicializar el Storage antes de cargar la app
export function initializeStorage(storageService: StorageService) {
  return () => storageService.init();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    importProvidersFrom(IonicStorageModule.forRoot()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeStorage,
      deps: [StorageService],
      multi: true
    }
  ],
});
import { bootstrapApplication } from '@angular/platform-browser';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular({
      mode: 'md'
    }),
    provideRouter(routes, withPreloading(PreloadAllModules))
  ]
}).catch((error: unknown) => console.error(error));

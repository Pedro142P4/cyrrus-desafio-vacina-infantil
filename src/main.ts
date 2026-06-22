import { bootstrapApplication } from '@angular/platform-browser';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';

// Importações do Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular({ mode: 'md' }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    
    // Configuração do Firebase com suas credenciais do print
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyD2NYGARNRg5q2OmD99iNY7Kqmj4WBXyis",
      authDomain: "cyrrus-desafio-vacina-infantil.firebaseapp.com",
      projectId: "cyrrus-desafio-vacina-infantil",
      storageBucket: "cyrrus-desafio-vacina-infantil.appspot.com",
      messagingSenderId: "931215582381",
      appId: "1:931215582381:web:2a81830495333f26194b62"
    })),
    provideFirestore(() => getFirestore())
  ]
}).catch((error: unknown) => console.error(error));
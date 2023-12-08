import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'kanbanfire-c1693',
          appId: '1:657717382965:web:3dfb0b0821a8346726c67c',
          storageBucket: 'kanbanfire-c1693.appspot.com',
          apiKey: 'AIzaSyA0Ohmua_jM6OIiy_0tFgYglcPPcVTPduU',
          authDomain: 'kanbanfire-c1693.firebaseapp.com',
          messagingSenderId: '657717382965',
          measurementId: 'G-VKDGJKEQ4X',
        })
      )
    ),
    importProvidersFrom(provideFirestore(() => getFirestore())),
  ],
};

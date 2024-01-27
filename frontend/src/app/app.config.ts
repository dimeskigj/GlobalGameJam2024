import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getDatabase, provideDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(provideFirebaseApp(() => initializeApp({ "projectId": "ggj24-5dbc8", "appId": "1:411841261679:web:bffec88fdf55dceb7b1d9a", "databaseURL": "https://ggj24-5dbc8-default-rtdb.europe-west1.firebasedatabase.app", "storageBucket": "ggj24-5dbc8.appspot.com", "apiKey": "AIzaSyDZc9B12pa5lSbb3IqxpXaf7XOtB4hVl68", "authDomain": "ggj24-5dbc8.firebaseapp.com", "messagingSenderId": "411841261679" }))), importProvidersFrom(provideDatabase(() => getDatabase()))
  ]
};

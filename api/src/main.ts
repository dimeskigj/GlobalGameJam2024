import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDZc9B12pa5lSbb3IqxpXaf7XOtB4hVl68",
  authDomain: "ggj24-5dbc8.firebaseapp.com",
  projectId: "ggj24-5dbc8",
  storageBucket: "ggj24-5dbc8.appspot.com",
  messagingSenderId: "411841261679",
  appId: "1:411841261679:web:bffec88fdf55dceb7b1d9a",
  databaseURL: "https://ggj24-5dbc8-default-rtdb.europe-west1.firebasedatabase.app/",
};

export const firebaseApp = initializeApp(firebaseConfig);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  });
  await app.listen(3000);
}
bootstrap();

import { Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { MenuPageComponent } from './components/menu-page/menu-page.component';

export const routes: Routes = [
    { path: ':player/:id', component: MainPageComponent },
    { path: '**', component: MenuPageComponent },
];

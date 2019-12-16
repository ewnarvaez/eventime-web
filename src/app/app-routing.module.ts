import { InteresComponent } from './interes/interes.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ModuleWithProviders} from '@angular/core';

// Importación de componentes
import { HomeComponent } from './home/home.component';
import { NewUserComponent } from './new-user/new-user.component';
import { NewEventComponent } from './new-event/new-event.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditUserResolver } from './edit-user/edit-user.resolver';
import { LoginComponent } from './auth/login/login.component';
import { ShowUsersComponent } from './show-users/show-users.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { EditEventResolver } from './edit-event/edit-event.resolver';
import { AuthGuard } from './auth/auth.guard';

// Array de Rutas

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'new-user', component: NewUserComponent, canActivate: [AuthGuard] },
  { path: 'new-event', component: NewEventComponent, canActivate: [AuthGuard] },
  { path: 'show-users', component: ShowUsersComponent, canActivate: [AuthGuard] },
  { path: 'interes', component: InteresComponent, canActivate: [AuthGuard] },
  { path: 'details/:id', component: EditUserComponent, resolve: {data : EditUserResolver} },
  { path: 'detailsEvent/:id', component: EditEventComponent, resolve: {data : EditEventResolver} },
  { path: '**', component: HomeComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);


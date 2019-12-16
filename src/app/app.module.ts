
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Importando componentes y routing

import { routing, appRoutingProviders } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewUserComponent } from './new-user/new-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditUserResolver } from './edit-user/edit-user.resolver';
import { HomeComponent } from './home/home.component';
import { AvatarDialogComponent } from './avatar-dialog/avatar-dialog.component';

// Importando servicios para formularios y firebase

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatButtonModule, MatInputModule, MatSliderModule, MatDialogModule, MatSelectModule } from '@angular/material';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { FirebaseService } from './services/firebase.service';
import { LoginComponent } from './auth/login/login.component';
import { NewEventComponent } from './new-event/new-event.component';
import { ShowUsersComponent } from './show-users/show-users.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { EditEventResolver } from './edit-event/edit-event.resolver';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FileSizeFormatPipe } from './new-event/file-size-format.pipe';
import { InteresComponent } from './interes/interes.component';
import {NgxPaginationModule} from 'ngx-pagination';


@NgModule({
  declarations: [
    AppComponent,
    NewUserComponent,
    EditUserComponent,
    HomeComponent,
    AvatarDialogComponent,
    LoginComponent,
    NewEventComponent,
    ShowUsersComponent,
    EditEventComponent,
    FileSizeFormatPipe,
    InteresComponent
  ],
  entryComponents: [AvatarDialogComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatDialogModule,
    NgxPaginationModule
  ],
  providers: [
    appRoutingProviders, FirebaseService, EditUserResolver, EditEventResolver, FileSizeFormatPipe
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }

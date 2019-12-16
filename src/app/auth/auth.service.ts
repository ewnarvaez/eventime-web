import { Rol } from './../new-user/new-user.component';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private eventAuthError = new BehaviorSubject<string>('');
  eventAuthError$ = this.eventAuthError.asObservable();
  newUser: any;
  public user: any;

  constructor(
  private afAuth: AngularFireAuth,
  private db: AngularFirestore,
  private	router: Router,
  public firebaseService: FirebaseService
  ) { }

  getUserState() {
    return this.afAuth.authState;
  }

  login( email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .catch(error => {
      this.eventAuthError.next(error);
    })
    .then(userCredential => {
      if (userCredential) {
        this.firebaseService.getUserByEmail(email)
        .subscribe(result => {
          // tslint:disable-next-line: prefer-const
          let userRol = 'rol';
          if (typeof(result[0]) !== 'undefined') {
            if (result[0][userRol] === 'Administrador') {
              const sideBar = document.getElementById('side-bar');
              sideBar.classList.add('show');
              this.router.navigate(['/home']);
            } else {
              alert('Necesitas permisos de administrador para acceder');
            }
          } else {
            const sideBar = document.getElementById('side-bar');
            sideBar.classList.remove('show');
            sideBar.classList.add('hide');
            alert('Tu cuenta no esta correctamente configurada');
          }
        });
      }
    });
  }

  logout() {
    const sideBar = document.getElementById('side-bar');
    sideBar.classList.remove('show');
    sideBar.classList.add('hide');
    return this.afAuth.auth.signOut();
  }
}

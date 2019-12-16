import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { FirebaseService } from '../services/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, public firebaseService: FirebaseService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged((user: firebase.User) => {
          if (user) {
            this.firebaseService.getUserByEmail(user.email)
            .subscribe(result => {
              // tslint:disable-next-line: prefer-const
              let userRol = 'rol';
              if (typeof(result[0]) !== 'undefined') {
                if (result[0][userRol] === 'Administrador') {
                  resolve(true);
                  // console.log('User is logged in');
                } else {
                  this.router.navigate(['login']);
                  resolve(false);
                  // console.log('User is not logged in');
                }
              }
            });
          } else {
            this.router.navigate(['login']);
            resolve(false);
            // console.log('User is not logged in');
          }
        });
      });
    }
  }

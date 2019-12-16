import { Component, OnInit } from '@angular/core';
import { FirebaseService } from './services/firebase.service';
import { Router, Params } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'eventime-web';
  user: firebase.User;

  constructor(
    public firebaseService: FirebaseService,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.getUserState()
      .subscribe( user => {
        this.user = user;
      });
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.auth.logout();
  }

}

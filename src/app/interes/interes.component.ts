import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Router, Params } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-interes',
  templateUrl: './interes.component.html',
  styleUrls: ['./interes.component.scss']
})

export class InteresComponent implements OnInit {

  items: Array<any>;
  user: firebase.User;
  config: any;
  avatarLink = '../../assets/images/eventime_small.png';

  constructor(
    public firebaseService: FirebaseService,
    private router: Router,
    private auth: AuthService
  ) {
    this.config = {
      itemsPerPage: 8,
      currentPage: 1,
    };
  }

  pageChanged(page: any) {
    this.config.currentPage = page;
  }

  ngOnInit() {
    this.getInteres();
    this.auth.getUserState()
      .subscribe( user => {
        this.user = user;
      });
    const sideBar = document.getElementById('side-bar');
    sideBar.classList.add('show');
  }

  getInteres() {
    this.firebaseService.getInteres()
    .subscribe(result => {
      this.items = result;
    });
  }

  deleteInt(id: any) {
    this.firebaseService.deleteInt(id);
  }

}

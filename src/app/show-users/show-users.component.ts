import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Router, Params } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-show-users',
  templateUrl: './show-users.component.html',
  styleUrls: ['./show-users.component.scss']
})
export class ShowUsersComponent implements OnInit {

  config: any;
  avatarLink = '../../assets/images/eventime_small.png';
  user: firebase.User;
  agedValue = 0;
  searchValue = '';
  items: Array<any>;
  // tslint:disable-next-line: variable-name
  name_filtered_items: Array<any>;
  // tslint:disable-next-line: variable-name
  aged_filtered_items: Array<any>;

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
    this.getData();
    this.auth.getUserState()
    .subscribe( user => {
      this.user = user;
    });
    const sideBar = document.getElementById('side-bar');
    sideBar.classList.add('show');
  }

  getData() {
    this.firebaseService.getUsers()
    .subscribe(result => {
      this.items = result;
      this.aged_filtered_items = result;
      this.name_filtered_items = result;
    });
  }

  viewDetails(item: any) {
    this.router.navigate(['/details/' + item.payload.doc.id]);
  }

  capitalizeFirstLetter(value: any) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  searchByName() {
    const value = this.searchValue.toLowerCase();
    this.firebaseService.searchUsers(value)
    .subscribe(result => {
      this.name_filtered_items = result;
      this.items = this.name_filtered_items;
      this.combineLists(result, this.name_filtered_items);
    });
  }

  dueDate(item: any) {
    const today = new Date(); // fecha actual
    const eventDate = new Date(item); // fecha del evento
    const fechaFutura = eventDate.getTime() + (90 * 24 * 60 * 60 * 1000); // fecha evento + 3 meses
    const fechaVencimiento = new Date(fechaFutura);
    if (fechaVencimiento > today) {
      console.log('Activa');
      return true;
    } else {
      console.log('Inactiva');
      return false;
    }
  }

  combineLists(a: any, b: any) {
    const result = [];

    a.filter(x => {
      return b.filter(x2 => {
        if (x2.payload.doc.id === x.payload.doc.id) {
          result.push(x2);
        }
      });
    });
    return result;
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.auth.logout();
  }

}

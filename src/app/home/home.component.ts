import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Router, Params } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  config: any;
  latitude = -28.68352;
  longitude = -147.20785;
  mapType = 'satellite';
  user: firebase.User;

  agedValue = 0;
  searchValue = '';
  items: Array<any>;
  // tslint:disable-next-line: variable-name
  aged_filtered_items: Array<any>;
  // tslint:disable-next-line: variable-name
  category_filtered_items: Array<any>;

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
    this.firebaseService.getEvents()
    .subscribe(result => {
      this.items = result;
      this.aged_filtered_items = result;
      this.category_filtered_items = result;
    });
  }

  viewDetails(item: any) {
    this.router.navigate(['/detailsEvent/' + item.payload.doc.id]);
  }

  capitalizeFirstLetter(value: any) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  searchByCategory() {
    const value = this.searchValue.toLowerCase();
    this.firebaseService.searchEvents(value)
    .subscribe(result => {
      this.category_filtered_items = result;
      this.items = this.combineLists(result, this.aged_filtered_items);
    });
  }

  rangeChange(event: any) {
    this.firebaseService.searchEventsByAged(event.value)
    .subscribe(result => {
      this.aged_filtered_items = result;
      this.items = this.combineLists(result, this.category_filtered_items);
    });
  }

  combineLists(a, b) {
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

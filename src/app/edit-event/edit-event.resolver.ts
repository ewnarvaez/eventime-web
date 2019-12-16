import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute } from "@angular/router";
import { FirebaseService } from '../services/firebase.service';

@Injectable()
export class EditEventResolver implements Resolve<any> {

  constructor(public firebaseService: FirebaseService) { }

  resolve(route: ActivatedRouteSnapshot,) {

    return new Promise((resolve, reject) => {
      let eventId = route.paramMap.get('id');
      this.firebaseService.getEvent(eventId)
      .subscribe(
        data => {
          resolve(data);
        }
      );
    })
  }
}


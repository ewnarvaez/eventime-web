import { evento } from './event';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../auth/auth.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

declare const google: any;

export interface Categoria {
  value: string;
  viewValue: string;
}

export interface MyData {
  name: string;
  fileref: string;
  filepath: string;
  size: number;
  date: Date;
}

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.scss']
})

export class NewEventComponent implements OnInit {

  @ViewChild('eventForm', null) eventForm: NgForm;

  model = new evento('', '', '', '', '', '', '', '', '', '');

// Upload Task
  task: AngularFireUploadTask;

  // Progress in percentage
  percentage: Observable<number>;

  // Snapshot of uploading file
  snapshot: Observable<any>;

  // Uploaded File URL
  UploadedFileURL: Observable<string>;

  // Uploaded Image List
  images: Observable<MyData[]>;

  // File details
  fileName: string;
  fileSize: number;

  // Status check
  isUploading: boolean;
  isUploaded: boolean;


  categorias: Categoria[] = [
    {value: 'Educacion', viewValue: 'Educación'},
    {value: 'Bienestar', viewValue: 'Bienestar'},
    {value: 'Egresados', viewValue: 'Egresados'}
  ];

  user: firebase.User;
  // tslint:disable-next-line: max-line-length
  // avatarLink: 'https://firebasestorage.googleapis.com/v0/b/arboreal-vector-251521.appspot.com/o/imagenes%2F1571957410562_eventime_small.png?alt=media&token=97ff38e7-75f3-475b-adda-4285ffd667d1';

  private imageCollection: AngularFirestoreCollection<MyData>;
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    public firebaseService: FirebaseService,
    private auth: AuthService,
    // private FileSizeFormatPipe: FileSizeFormatPipe,
    private storage: AngularFireStorage,
    private database: AngularFirestore) {
      this.isUploading = false;
      this.isUploaded = false;
      // Set collection where our documents/ images info will save
      this.imageCollection = database.collection<MyData>('imagenes', ref => ref.orderBy('date', 'desc').limit(1));
      this.images = this.imageCollection.valueChanges();
    }

  ngOnInit() {
    this.auth.getUserState()
    .subscribe( user => {
      this.user = user;
    });
    this.eventForm.reset();
    this.loadMap(this.model);
    const sideBar = document.getElementById('side-bar');
    sideBar.classList.add('show');
    // tslint:disable-next-line: max-line-length
    this.model.url = 'https://firebasestorage.googleapis.com/v0/b/arboreal-vector-251521.appspot.com/o/imagenes%2F1575933544920_eventime_small.png?alt=media&token=644de97b-3586-44cb-9d52-e049e1f2e4b3';
  }

  loadMap(model: any) {
    const mapProp = {
      center: new google.maps.LatLng(2.483130, -76.561910),
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.SATELITE
    };
    const map = new google.maps.Map(document.getElementById('googleMap'), mapProp);
    const input = document.getElementById('searchInput');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    const infowindow = new google.maps.InfoWindow();
    const marker = new google.maps.Marker({
        map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    // tslint:disable-next-line: only-arrow-functions
    autocomplete.addListener('place_changed', function() {
      infowindow.close();
      marker.setVisible(false);
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        window.alert('Autocomplete\'s returned place contains no geometry');
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }
      marker.setIcon(({
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
      }));
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      let address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }

      infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
      infowindow.open(map, marker);

      // Location details
      // tslint:disable-next-line: prefer-for-of
      /*for (let i = 0; i < place.address_components.length; i++) {
        if (place.address_components[i].types[0] === 'postal_code') {
            document.getElementById('postal_code').innerHTML = place.address_components[i].long_name;
        }
        if (place.address_components[i].types[0] === 'country') {
            document.getElementById('country').innerHTML = place.address_components[i].long_name;
        }
      }*/
      document.getElementById('location').innerHTML = place.formatted_address;
      document.getElementById('lat').innerHTML = place.geometry.location.lat();
      document.getElementById('lon').innerHTML = place.geometry.location.lng();
    });

    // tslint:disable-next-line: only-arrow-functions
    google.maps.event.addListener(map, 'click', function(event: any) {
      // get lat/lon of click
      const clickLat = event.latLng.lat();
      const clickLon = event.latLng.lng();

      // show in input box
      model.latitud = clickLat.toFixed(5);
      model.longitud = clickLon.toFixed(5);

      let marker = new google.maps.Marker({
        position: new google.maps.LatLng(clickLat, clickLon),
        map
      });
    });
  }

  onSubmit(value: any) {
    this.firebaseService.createEvent(this.eventForm.value)
    .then(
      res => {
        this.eventForm.reset();
        this.router.navigate(['/home']);
      }
    );
  }

  uploadFile(event: FileList) {
    // The File object
    const file = event.item(0);
    // const avatar = document.getElementById('avatar');
    // avatar.style.display = 'none';
    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') {
     console.error('unsupported file type :( ');
     return;
    }

    this.isUploading = true;
    this.isUploaded = false;
    this.fileName = file.name;

    // The storage path
    const path = `imagenes/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    // const customMetadata = { app: 'Imagen propiedad de EvenTime' };

    // File reference
    const fileRef = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file);

    // Get file progress percentage
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      finalize(() => {
        // Get uploaded file storage path
        this.UploadedFileURL = fileRef.getDownloadURL();
        this.UploadedFileURL.subscribe(resp => {
          this.addImagetoDB({
            name: file.name,
            fileref: path,
            filepath: resp,
            size: this.fileSize,
            date: new Date()
          });
          this.model.url = resp;
          this.isUploading = false;
          this.isUploaded = true;
        }, error => {
          console.error(error);
        });
      }),
      tap(snap => {
          this.fileSize = snap.totalBytes;
      })
    );
  }

  addImagetoDB(image: MyData) {
    // Create an ID for document
    const id = this.database.createId();
    // Set document id with value in database
    this.imageCollection.doc(id).set(image).then(resp => {
      console.log(resp);
    }).catch(error => {
      console.log('error ' + error);
    });
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.auth.logout();
  }
}

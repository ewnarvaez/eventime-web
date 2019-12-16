import { FirebaseService } from './../services/firebase.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { evento } from '../new-event/event';
import { post } from 'selenium-webdriver/http';
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
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent implements OnInit {

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

  itemEvent: any;
  user: firebase.User;
  public imagenes: any[];

  private imageCollection: AngularFirestoreCollection<MyData>;
  constructor(
    public firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private storage: AngularFireStorage,
    private auth: AuthService,
    private database: AngularFirestore) {
      this.isUploading = false;
      this.isUploaded = false;
      // Set collection where our documents/ images info will save
      this.imageCollection = database.collection<MyData>('imagenes', ref => ref.orderBy('date', 'desc').limit(1));
      this.images = this.imageCollection.valueChanges();
    }

  ngOnInit() {
    this.route.data.subscribe(routeData => {
      // tslint:disable-next-line: no-string-literal
      const data = routeData['data'];
      if (data) {
        this.itemEvent = data.payload.data();
        this.itemEvent.id = data.payload.id;
        this.model.categoria = this.itemEvent.categoria;
        this.model.nombre = this.itemEvent.nombre;
        this.model.direccion = this.itemEvent.direccion;
        this.model.latitud = this.itemEvent.latitud;
        this.model.longitud = this.itemEvent.longitud;
        this.model.telefono = this.itemEvent.telefono;
        this.model.url = this.itemEvent.urlImagen;
        this.model.descripcion = this.itemEvent.descripcion;
        this.model.fecha = this.itemEvent.fecha;
        this.model.inscripcion = this.itemEvent.urlInscripcion;
      }
    });
    this.auth.getUserState()
    .subscribe( user => {
      this.user = user;
    });
    this.loadMap(this.model);
    const sideBar = document.getElementById('side-bar');
    sideBar.classList.add('show');
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
    // value.avatar = this.itemEvent.avatar;
    this.firebaseService.updateEvent(this.itemEvent.id, this.eventForm.value)
    .then(
      res => {
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
    console.log(fileRef);

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

  delete() {
    this.firebaseService.getImageByUrlImagen(this.itemEvent.urlImagen)
    .subscribe(result => {
      console.log('Url de la imagen', this.itemEvent.urlImagen);
      this.imagenes = [];
      // tslint:disable-next-line: no-shadowed-variable
      result.map(result => {
        this.imagenes.push({
          id: result.payload.doc.id,
          data: result.payload.doc.data()
        });
        if (this.imagenes['0'].data.name !== 'eventime_small.png') {
          this.firebaseService.deleteImageCollection(this.imagenes['0'].id)
          .then(() => {
            console.log('Colección Eliminada');
          }).catch(err => {
            console.log(err);
          });
          const storageRef = this.storage.storage.ref();
          console.log(this.imagenes['0'].data.name);
          storageRef.child(this.imagenes['0'].data.fileref).delete()
          .then(() => {
            console.log('Archivo eliminado');
          }).catch(err => {
            console.log(err);
          });
        }
        this.firebaseService.deleteEvent(this.itemEvent.id)
        .then(
          res => {
            this.router.navigate(['/home']);
          },
          err => {
            console.log(err);
          }
        );
      });
    });

    /*
    const storageRef = this.storage.storage.ref();
    storageRef.child(this.imagenes['0'].data.name).delete()
    .then(() => {
      console.log('Archivo eliminado');
    }).catch(err => {
      console.log(err);
    });
    this.firebaseService.deleteImageCollection(this.imagenes['0'].id)
    .then(() => {
      console.log('Colección Eliminada');
    }).catch(err => {
      console.log(err);
    });
    this.firebaseService.deleteEvent(this.itemEvent.id)
    .then(
      res => {
        this.router.navigate(['/home']);
      },
      err => {
        console.log(err);
      }
    );
    */
  }

  cancel() {
    this.router.navigate(['/home']);
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

}

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public db: AngularFirestore) {}

  getAvatars() {
      return this.db.collection('avatar').valueChanges();
  }

  getUser(userKey: any) {
    return this.db.collection('users').doc(userKey).snapshotChanges();
  }

  getEvent(eventKey: any) {
    return this.db.collection('Evento').doc(eventKey).snapshotChanges();
  }

  updateUser(userKey: any, value: any) {
    value.nameToSearch = value.nombre.toLowerCase();
    return this.db.collection('users').doc(userKey).set(value);
  }

  updateEvent(eventKey: any, value: any) {
    value.nameToSearch = value.categoria.toLowerCase();
    return this.db.collection('Evento').doc(eventKey).set(value);
  }

  deleteUser(userKey: any) {
    return this.db.collection('users').doc(userKey).delete();
  }

  deleteEvent(eventKey: any) {
    return this.db.collection('Evento').doc(eventKey).delete();
  }

  deleteImageCollection(imageKey: any) {
    return this.db.collection('imagenes').doc(imageKey).delete();
  }

  deleteInt(eventKey: any) {
    return this.db.collection('Interes').doc(eventKey).delete();
  }

  getUsers() {
    return this.db.collection('users').snapshotChanges();
  }

  getEvents() {
    return this.db.collection('Evento').snapshotChanges();
  }

  getInteres() {
    return this.db.collection('Interes').snapshotChanges();
  }

  getUserByEmail(email: any) {
    return this.db.collection('users', ref => ref.where('correo', '==', email)).valueChanges();
  }

  getImageByUrlImagen(urlImagen: string) {
    return this.db.collection('imagenes', ref => ref.where('filepath', '==', urlImagen)).snapshotChanges();
  }

  searchUsers(searchValue: any) {
    return this.db.collection('users', ref => ref.where('nameToSearch', '>=', searchValue)
      .where('nameToSearch', '<=', searchValue + '\uf8ff'))
      .snapshotChanges();
  }

  searchEvents(searchValue: any) {
    return this.db.collection('Evento', ref => ref.where('nameToSearch', '>=', searchValue)
      .where('nameToSearch', '<=', searchValue + '\uf8ff'))
      .snapshotChanges();
  }

  searchUsersByAge(value: any) {
    return this.db.collection('users', ref => ref.orderBy('age').startAt(value)).snapshotChanges();
  }

  searchEventsByAged(value: any) {
    return this.db.collection('Evento', ref => ref.orderBy('fecha').startAt(value)).snapshotChanges();
  }

  createUser(value: any, avatar: any) {
    const fechaHoy = new Date();
    const fechaFormateada = fechaHoy.getFullYear() + '/' +  fechaHoy.getMonth() + '/' + fechaHoy.getDate();

    return this.db.collection('users').add({
      nombre: value.nombre,
      nameToSearch: value.nombre.toLowerCase(),
      correo: value.correo,
      rol: value.rol,
      fechaIngreso: fechaFormateada.toString()
    });
  }

  createEvent(value: any) {
    return this.db.collection('Evento').add({
      categoria: value.categoria,
      descripcion: value.descripcion,
      direccion: value.direccion,
      fecha: value.fecha,
      latitud: value.lat,
      longitud: value.lon,
      nombre: value.nombre,
      telefono: value.telefono,
      urlImagen: value.url,
      nameToSearch: value.categoria.toLowerCase(),
      urlInscripcion: value.inscripcion
    });
  }
}

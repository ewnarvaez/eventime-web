import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AvatarDialogComponent } from '../avatar-dialog/avatar-dialog.component';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';

export interface Rol {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  rols: Rol[] = [
    {value: 'Usuario', viewValue: 'Usuario'},
    {value: 'Administrador', viewValue: 'Administrador'}
  ];

  avatarLink = 'assets/images/eventime_small.png';
  exampleForm: FormGroup;
  item: any;

  validation_messages = {
   'nombre': [
     { type: 'required', message: 'El nombre es obligatorio.' }
   ],
   'correo': [
     { type: 'required', message: 'El correo es obligatorio.' }
   ],
   'rol': [
     { type: 'required', message: 'El rol es obligatorio.' },
   ]
 };

  constructor(
    public firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.route.data.subscribe(routeData => {
      // tslint:disable-next-line: no-string-literal
      let data = routeData['data'];
      if (data) {
        this.item = data.payload.data();
        this.item.id = data.payload.id;
        this.createForm();
      }
    });
    const sideBar = document.getElementById('side-bar');
    sideBar.classList.add('show');
  }

  createForm() {
    this.exampleForm = this.fb.group({
      nombre: [this.item.nombre, Validators.required],
      correo: [this.item.correo, Validators.required],
      rol: [this.item.rol, Validators.required]
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(AvatarDialogComponent, {
      height: '400px',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.item.avatar = result.link;
      }
    });
  }

  onSubmit(value) {
    this.firebaseService.updateUser(this.item.id, value)
    .then(
      res => {
        this.router.navigate(['/show-users']);
      }
    )
  }

  delete() {
    this.firebaseService.deleteUser(this.item.id)
    .then(
      res => {
        this.router.navigate(['/show-users']);
      },
      err => {
        console.log(err);
      }
    );
  }

  cancel(){
    this.router.navigate(['/home']);
  }

}

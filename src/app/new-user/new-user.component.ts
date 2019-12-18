import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AvatarDialogComponent } from '../avatar-dialog/avatar-dialog.component';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../auth/auth.service';

export interface Rol {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

  rols: Rol[] = [
    {value: 'Usuario', viewValue: 'Usuario'},
    {value: 'Administrador', viewValue: 'Administrador'}
  ];

  user: firebase.User;

  exampleForm: FormGroup;
  avatarLink = 'assets/images/eventime_small.png';

  validation_messages = {
   'correo': [
     { type: 'required', message: 'El correo es obligatorio.' }
   ],
   'nombre': [
     { type: 'required', message: 'El nombre es obligatorio.' }
   ],
   'rol': [
     { type: 'required', message: 'El rol es obligatorio.' },
   ]
 };

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    public firebaseService: FirebaseService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.createForm();
    this.auth.getUserState()
      .subscribe( user => {
        this.user = user;
      });
    const sideBar = document.getElementById('side-bar');
    sideBar.classList.add('show');
  }

  createForm() {
    this.exampleForm = this.fb.group({
      correo: ['', Validators.required ],
      nombre: ['', Validators.required ],
      rol: ['', Validators.required ]
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(AvatarDialogComponent, {
      height: '400px',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.avatarLink = result.link;
      }
    });
  }

  resetFields(){
    this.avatarLink = '../../assets/images/eventime_small.png';
    this.exampleForm = this.fb.group({
      correo: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      rol: new FormControl('', Validators.required),
    });
  }

  onSubmit(value){
    this.firebaseService.createUser(value, this.avatarLink)
    .then(
      res => {
        this.resetFields();
        this.router.navigate(['/home']);
      }
    )
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.auth.logout();
  }

}

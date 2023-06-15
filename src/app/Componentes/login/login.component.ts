import { Component, OnInit } from '@angular/core';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formulario!: FormGroup;

  usuariosDePrueba = [
    {email:"administrador1@gmail.com",pass:"111111", tipo:'Paciente'},
    {email:"raul.gonzalez@sarasa.com",pass:"123456", tipo:'Paciente'},
    {email:"felipe.gonzalez@sarasa.com",pass:"123456", tipo:'Paciente'},
    {email:"asdf2@gmail.com",pass:"111111", tipo:'Especialista'},
    {email:"raul.gonzalez@sarasa.com",pass:"123456", tipo:'Especialista'},
    {email:"administrador1@gmail.com",pass:"111111", tipo:'Administrador'}
];

  constructor(private userAuth:UserAuthService, private fb: FormBuilder, private ruteador:Router) {
    this.formulario = this.fb.group({
      'email': ['asdf@gmail.com', [Validators.required, Validators.email]],
      'password': ['111111', Validators.required],
    });
   }

  loguear(usuario:string, password:string){
    console.info(usuario, password);
    this.userAuth.ingresar(usuario,password)
    .then(()=> this.ruteador.navigate(['home']))
    .catch(error => console.info(error));

  }

  setearCampos(email:string,password:string){
    this.formulario.controls['email'].setValue(email);
    this.formulario.controls['password'].setValue(password);
  }

  
  onSubmit(f: any) {
    //console.info(f);
    this.loguear(f.email, f.password);
    //this.router.navigate(['welcome']);
  }

  ngOnInit(): void {
  }

}

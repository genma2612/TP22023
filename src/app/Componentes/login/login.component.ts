import { Component, OnInit } from '@angular/core';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formulario!: FormGroup;

  usuariosDePrueba = [
    { email: "paciente1@gmail.com", pass: "111111", tipo: 'Paciente' },
    { email: "paciente2@gmail.com", pass: "111111", tipo: 'Paciente' },
    { email: "especialista1@gmail.com", pass: "111111", tipo: 'Especialista' },
    { email: "especialista2@gmail.com", pass: "111111", tipo: 'Especialista' },
    { email: "administrador1@gmail.com", pass: "111111", tipo: 'Administrador' },
    { email: "administrador2@gmail.com", pass: "111111", tipo: 'Administrador' }
  ];

  constructor(private userAuth: UserAuthService, private fb: FormBuilder, private ruteador: Router, private spinner: NgxSpinnerService) {
    this.formulario = this.fb.group({
      'email': ['asdf@gmail.com', [Validators.required, Validators.email]],
      'password': ['111111', Validators.required],
    });
  }

  loguear(usuario: string, password: string) {
    //console.info(usuario, password);
    this.spinner.show();
    this.userAuth.ingresar(usuario, password)
      .then((userCredential) => {
        if (!userCredential.user.emailVerified) { //Verificar los usuarios de proeuba e implementar el guard para especialistas habilitados o inhabilitados por el administrador
          this.userAuth.traerUsuarioDeFirestore(userCredential.user).then(
            snapshot => {
              this.userAuth.saveToLocalstorage(snapshot.data());
              this.ruteador.navigate(['home'])
              this.spinner.hide();
              //this.userAuth.guardarInicioDeSesion(snapshot.data());
            }
          );
        }
        else {
          this.userAuth.salir().then(() => {
            alert('El correo no está verificado o el administrador no le brindó acceso');
            this.spinner.hide();
          });
        }
      })
      .catch(error => console.info(error));

  }

  setearCampos(email: string, password: string) {
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
